class V1::BudgetsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    # yyyy-mm-ddの形でフロントから取得
    set_month = request.headers['currentMonth'] # フロントから取得（例: "2024-12-01"）
    date = Date.strptime(set_month, '%Y-%m-%d') # 文字列をDate型に変換
    first_month = (date - 1.month).beginning_of_month # 先月の初日
    end_month = (date - 1.month).end_of_month # 先月の最終日

    budgets = ExpenseCategory
    .select(
      'expense_categories.id',
      'expense_categories.name',
      'COALESCE(SUM(expense_logs.amount), 0) AS last_month_expense',
      'budgets.budget',
      'budgets.month'
    )
    # 期間の追加が必要
    .joins(
      <<~SQL
        LEFT OUTER JOIN budgets 
        ON expense_categories.id = budgets.expense_category_id 
        AND budgets.user_id = #{current_v1_user.id}
        AND budgets.month = '#{set_month}'
      SQL
    )
    # 期間を変数にして渡すことが必要
    .joins(
      <<~SQL
        LEFT OUTER JOIN expense_logs 
        ON expense_categories.id = expense_logs.expense_category_id 
        AND expense_logs.date BETWEEN '#{first_month}' AND '#{end_month}'
      SQL
    )
    .group(
      'expense_categories.id, expense_categories.name, budgets.budget, budgets.month'
    )
    .order('expense_categories.id ASC')

    total_budget = budgets.sum { |b| b.budget.to_i }
  
    render json: {
      budgets: budgets,
      total_budget: total_budget
    }, status: :ok
  end

  def create
    budgets = budget_params
    
    budgets.each do |budget_params|
      # 条件に一致するレコードを探す
      budget = Budget.find_by(
        user_id: current_v1_user.id,
        month: budget_params[:month],
        expense_category_id: budget_params[:expense_category_id]
      )
      
      # レコードが見つからない場合、新規作成
      if budget.nil?
        budget = Budget.create!(
          user_id: current_v1_user.id,
          month: budget_params[:month],
          expense_category_id: budget_params[:expense_category_id],
          budget: budget_params[:budget]
        )
      else
        # 見つかった場合、予算を更新
        budget.budget = budget_params[:budget]
        budget.save!
      end
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
