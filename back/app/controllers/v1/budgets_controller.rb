class V1::BudgetsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    # 今日の日付を取ってきて1日とする
    set_month = Date.today.beginning_of_month

    # ログイン中ユーザーを取得しidの順に並び替え
    budgets = Budget.where(user_id: current_v1_user.id, month: set_month).order(:id)

    render json: budgets
  end

  def create
    budgets = budget_params
    
      budgets.each do |budget_params|
        # 条件に一致するレコードを探すか、新規作成
        budget = Budget.find_or_initialize_by(
          user_id: current_v1_user.id,
          month: budget_params[:month],
          expense_category_id: budget_params[:expense_category_id]
        )
        
        # 値を更新
        budget.budget = budget_params[:budget]
        
        # 保存
        budget.save!
      end
    
      render json: { message: "予算を保存しました" }, status: :ok

  end

  private

  def budget_params
    params.require(:budgets).map do |budget|
      budget.permit(:expense_category_id, :budget, :month)
    end
  end
end
