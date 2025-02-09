class V1::ShiftsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    date = params[:date]
  
    start_of_day = Time.zone.parse(date).beginning_of_day
    end_of_day = Time.zone.parse(date).end_of_day
  
    shifts = Shift.joins(:job)
      .where(user_id: current_v1_user)
      .where("shifts.start_time BETWEEN ? AND ? OR shifts.end_time BETWEEN ? AND ?", start_of_day, end_of_day, start_of_day, end_of_day)
      .select(
        'shifts.id',
        'shifts.start_time',
        'shifts.end_time',
        'shifts.break_time',
        'shifts.memo',
        'jobs.id AS job_id',
        'jobs.name',
        'jobs.hourly_wage',
        'jobs.night_wage',
        'jobs.training_wage',
        'jobs.training_start',
        'jobs.training_end',
        'jobs.training_time',
        'jobs.training_settings'
      )
  
      shifts_with_salary = shifts.map do |shift|
        work_time = hours_between(shift.start_time, shift.end_time) - shift.break_time
      
        past_training_hours = total_past_training_hours(current_v1_user, shift.job_id, shift.start_time)
        remaining_training_hours = shift.training_time - past_training_hours
      
        # 研修期間かどうか判定
        is_training_period = shift.training_start.present? && shift.training_end.present? &&
                              shift.start_time >= shift.training_start && shift.start_time <= shift.training_end
      
        if shift.training_settings == Job.training_settings[:training_time] && remaining_training_hours > 0
          training_hours = [work_time, remaining_training_hours].min
          normal_hours = work_time - training_hours
        else
          training_hours = 0
          normal_hours = work_time
        end
      
        total_salary = 0
      
        if is_training_period
          # 研修期間中はすべて研修給料
          total_salary = work_time * shift.training_wage
        else
          # 研修期間外のみ深夜給料を適用
          night_hours = calculate_night_hours(shift.start_time, shift.end_time)
          normal_hours -= night_hours
      
          total_salary = (training_hours * shift.training_wage) +
                         (normal_hours * shift.hourly_wage) +
                         (night_hours * shift.night_wage)
        end
      
        shift.as_json.merge(
          total_salary: total_salary.to_i,
          past_training_hours: past_training_hours,
          training_hours: training_hours,
          normal_hours: normal_hours,
          night_hours: is_training_period ? 0 : night_hours, # 研修期間中は夜間時間を0にする
          work_time: work_time
        )
      end
      
  
    render json: shifts_with_salary
  end
  
  
  def create
    shift = current_v1_user.shifts.new(shift_params)
    if shift.save
      render json: { message: "shift created successfully", job: shift }, status: :created
    else
      render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    shift = Shift.find_by(id: params[:id])

    if shift.nil?
      render json: { error: "シフト情報が見つかりません" }, status: :not_found
      return
    end
  
    # レコードの更新
    shift.update!(shift_params)
  
    render json: { message: "シフト情報を更新しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    shift = Shift.find_by(id: params[:id])
    if shift
      shift.destroy
      render json: { message: "シフト情報を削除しました。" }, status: :ok
    else
      render json: { error: "シフト情報がデータベースに見つかりませんでした。" }, status: :not_found
    end
  end

  private

    # 労働時間の計算（翌日にまたがる場合を考慮）
    def hours_between(start_time, end_time)
      if end_time < start_time
        ((end_time + 1.day) - start_time) / 3600
      else
        (end_time - start_time) / 3600
      end
    end
    
    # 過去の研修時間を合計（現在のシフトの開始時間より前のデータのみ対象）
    def total_past_training_hours(user, job_id, current_shift_start_time)
      Shift.joins(:job)
        .where(user_id: user, job_id: job_id)
        .where("shifts.start_time < ?", current_shift_start_time)
        .where("jobs.training_settings = ?", Job.training_settings[:training_time]) # training_time のみ対象
        .sum("EXTRACT(EPOCH FROM (shifts.end_time - shifts.start_time - shifts.break_time * INTERVAL '1 second')) / 3600.0") # 時間単位に変換
    end
    
    def calculate_night_hours(start_time, end_time)
      night_start = start_time.change(hour: 22, min: 0, sec: 0) # 22:00
      night_end = start_time.change(hour: 5, min: 0, sec: 0) + 1.day # 翌朝5:00
    
      # 勤務時間が22:00～5:00の間にあるかチェック
      night_start_time = [start_time, night_start].max
      night_end_time = [end_time, night_end].min
    
      # 深夜時間帯が有効なら計算（秒→時間換算）
      if night_start_time < night_end_time
        (night_end_time - night_start_time) / 3600.0
      else
        0
      end
    end

  def shift_params
    params.require(:shift).permit(:job_id, :start_time, :end_time, :break_time, :memo)
  end
end
