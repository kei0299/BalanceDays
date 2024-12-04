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

  def update
    income_log = IncomeLog.find(params[:id])

    if income_log.nil?
      render json: { error: "収入ログが見つかりません" }, status: :not_found
      return
    end
  
    # レコードの更新
    income_log.update!(income_logs_params)
  
    render json: { message: "収入ログを更新しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
  

  private

  def income_logs_params
    params.require(:income_log).permit(:amount, :income_category_id, :date, :memo)
  end
end
