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

    amount = income_logs_params[:amount].to_i
    user = User.find(current_v1_user.id)
    
    if user.balance.present?
      user.update!(balance: user.balance + amount)
    end

    render json: { message: "収入を保存しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    income_log = IncomeLog.find_by(id: params[:id])
  
    if income_log.nil?
      render json: { error: "収入ログが見つかりません" }, status: :not_found
      return
    end
  
    # 元々の金額を取得
    original_amount = income_log.amount
  
    # 入力された新しい金額を取得
    new_amount = income_logs_params[:amount].to_i
  
    # 差分を計算
    amount_difference = new_amount - original_amount
  
    # ユーザーの残高を更新
    user = User.find(current_v1_user.id)
    if user.balance.present?
      user.update!(balance: user.balance + amount_difference)
    end
  
    # レコードの更新
    income_log.update!(income_logs_params)
  
    render json: { message: "収入ログを更新しました" }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  rescue => e
    render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
  end
  
  

  private

  def income_logs_params
    params.require(:income_log).permit(:amount, :income_category_id, :date, :memo)
  end
end
