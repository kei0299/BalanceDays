class V1::ShiftsController < ApplicationController
  before_action :authenticate_user!

  def index
    shifts = Shift.where(user_id: current_v1_user)
    render json: shifts
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

  def shift_params
    params.require(:shift).permit(:job_id, :start_time, :end_time, :break_time, :memo)
  end
end
