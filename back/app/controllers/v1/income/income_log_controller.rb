class V1::Income::IncomeLogController < ApplicationController
  before_action :authenticate_v1_user!
  
  def create
    IncomeLog.create!(
      amount: income_logs_params[:amount],
      user_id: current_v1_user.id,
      income_category_id: income_logs_params[:income_category_id],
      date: income_logs_params[:date],
      memo: income_logs_params[:memo]
    )

    render json: { message: "収入を保存しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def income_logs_params
    params.permit(:amount, :income_category_id, :date, :memo)
  end
end
