class V1::Expense::ExpenseLogController < ApplicationController
  before_action :authenticate_user!

  def create
    ExpenseLog.create!(
      amount: expense_logs_params[:amount],
      user_id: current_user.id,
      expense_category_id: expense_logs_params[:expense_category_id],
      date: expense_logs_params[:date],
      memo: expense_logs_params[:memo]
    )

    render json: { message: "支出を保存しました" }, status: :ok
  rescue => e
    Rails.logger.error("Create Error: #{e.class} - #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
  end

  def update
    expense_log = ExpenseLog.find(params[:id])

    if expense_log.nil?
      render json: { error: "支出ログが見つかりません" }, status: :not_found
      return
    end
  
    # レコードの更新
    expense_log.update!(expense_logs_params)
  
    render json: { message: "収入ログを更新しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def expense_logs_params
    params.require(:expense_log).permit(:amount, :expense_category_id, :date, :memo)
  end
end
