class V1::Expense::ExpenseLogController < ApplicationController
  before_action :authenticate_v1_user!

  def create
    ExpenseLog.create!(
      amount: expense_logs_params[:amount],
      user_id: current_v1_user.id,
      expense_category_id: expense_logs_params[:expense_category_id],
      date: expense_logs_params[:date],
      memo: expense_logs_params[:memo]
    )

    amount = expense_logs_params[:amount].to_i
    user = User.find(current_v1_user.id)
    
    if user.balance.present?
      user.update!(balance: user.balance - amount)
    end

    render json: { message: "支出を保存しました", balance: user.balance }, status: :ok
  rescue => e
    Rails.logger.error("Create Error: #{e.class} - #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))
    render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
  end

  def update
    expense_log = ExpenseLog.find_by(id: params[:id])
  
    if expense_log.nil?
      render json: { error: "収入ログが見つかりません" }, status: :not_found
      return
    end
  
    # 元々の金額を取得
    original_amount = expense_log.amount
  
    # 入力された新しい金額を取得
    new_amount = expense_logs_params[:amount].to_i
  
    # 差分を計算
    amount_difference = new_amount - original_amount
  
    # ユーザーの残高を更新
    user = User.find(current_v1_user.id)
    if user.balance.present?
      user.update!(balance: user.balance + amount_difference)
    end
  
    # レコードの更新
    expense_log.update!(expense_logs_params)
  
    render json: { message: "収入ログを更新しました" }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue => e
    render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
  end
  

  private

  def expense_logs_params
    params.require(:expense_log).permit(:amount, :expense_category_id, :date, :memo)
  end
end
