class V1::BudgetsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    # yyyy-mm-ddの形でフロントから取得
    set_month = request.headers['currentMonth'] # フロントから取得（例: "2024-12-01"）
    date = Date.strptime(set_month, '%Y-%m-%d') # 文字列をDate型に変換
    avg_first_month = (date - 12.month).beginning_of_month # (例： "2023-12-01")
    first_month = (date - 1.month).beginning_of_month # (例： "2024-11-01")
    end_month = (date - 1.month).end_of_month # # (例： "2024-11-30")

    # 今月の予算を取得
    budgets = ExpenseCategory
    .select(
      'expense_categories.id',
      'expense_categories.name',
      'COALESCE(SUM(expense_logs.amount), 0) AS last_month_expense',
      'budgets.budget',
      'budgets.month'
    )
    .joins(
      <<~SQL
        LEFT OUTER JOIN budgets 
        ON expense_categories.id = budgets.expense_category_id 
        AND budgets.user_id = #{current_v1_user.id}
        AND budgets.month = '#{set_month}'
      SQL
    )
    .joins(
      <<~SQL
        LEFT OUTER JOIN expense_logs 
        ON expense_categories.id = expense_logs.expense_category_id 
        AND expense_logs.user_id = #{current_v1_user.id}
        AND expense_logs.date BETWEEN '#{first_month}' AND '#{end_month}'
      SQL
    )
    .group(
      'expense_categories.id, expense_categories.name, budgets.budget, budgets.month'
    )
    .order('expense_categories.id ASC')

    # 今月の予算合計
    total_budget = budgets.sum { |b| b.budget.to_i }

    # キャラチェンジ_先月〜12ヶ月間の平均金額
    avg_budgets = ExpenseCategory
    .select(
      'budgets.month AS month',
      'COALESCE(SUM(budgets.budget), 0) AS total_budget'
    )
    .joins(
      <<~SQL
        LEFT OUTER JOIN budgets 
        ON expense_categories.id = budgets.expense_category_id
        AND budgets.month BETWEEN '#{avg_first_month}' AND '#{end_month}'
        AND budgets.user_id = #{current_v1_user.id}
      SQL
    )
    .group('budgets.month')

    # 合計して取得したavg_budgetsの数で割る
    avg_budget = avg_budgets.sum { |b| b.total_budget.to_i } / avg_budgets.size.to_i

    # キャラクターをユーザーテーブルに登録
    user = User.find_by(id: current_v1_user)
    
    if user && user.balance && user.warning_lv && user.caution_lv
      balance = user.balance
      warning_lv = user.warning_lv
      caution_lv = user.caution_lv
      set_life = balance / avg_budget
  
      set_chara_status =
      if warning_lv > set_life
        3
      elsif caution_lv > set_life
        2
      else
        1
      end

      user.update!(chara_status: set_chara_status)

    end
  
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
