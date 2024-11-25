class V1::Auth::ExpenseLogController < ApplicationController
  before_action :authenticate_v1_user!
  
  def create
    ExpenseLog.create!(
      amount: expense_logs_params[:amount],
      user_id: current_v1_user.id,
      expense_category_id: expense_logs_params[:expense_category_id],
      date: expense_logs_params[:date],
      memo: expense_logs_params[:memo]
    )

    render json: { message: "支出を保存しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def expense_logs_params
    params.permit(:amount, :expense_category_id, :date, :memo)
  end
end
