class V1::JobsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    jobs = Job.where(user_id: current_v1_user)
    render json: jobs
  end

  def company_index
    jobs = Job.where(user_id: current_v1_user).as_json(only: [:id, :name])
    render json: jobs
  end

  def create
    job = current_v1_user.jobs.build(job_params) 
    if job.save
      render json: { message: "Job created successfully", job: job }, status: :created
    else
      render json: { errors: job.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    job = Job.find_by(id: params[:id])

    if job.nil?
      render json: { error: "勤務先情報が見つかりません" }, status: :not_found
      return
    end
  
    # レコードの更新
    job.update!(job_params)
  
    render json: { message: "勤務先情報を更新しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    job = Job.find_by(id: params[:id])
    if job
      job.destroy
      render json: { message: "勤務先情報を削除しました。" }, status: :ok
    else
      render json: { error: "勤務先情報がデータベースに見つかりませんでした。" }, status: :not_found
    end
  end

  private

  def job_params
    params.require(:job).permit(:user_id, :name, :hourly_wage, :night_wage, :training_wage, :training_start, :training_end, :closing_day, :payout_day, :payout_month_type, :income_category_id, :training_time, :training_settings)
  end
end
