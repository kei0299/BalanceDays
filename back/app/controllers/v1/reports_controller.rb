class V1::ReportsController < ApplicationController
  before_action :authenticate_v1_user!

  def pie_chart
    month_param = params[:month]
    month = Date.parse(month_param)
    end_month = (month - 0.month).end_of_month
    checked = params[:checked]

    # 収入がtrue,支出がfalse
      if checked == "true"
        totalIncome = IncomeCategory
        .select(
          'income_categories.id',
          'income_categories.name',
          'COALESCE(SUM(income_logs.amount), 0) AS current_month_amount',
          # 'budgets.budget',
          # 'budgets.month'
        )
        .joins(
          <<~SQL
            LEFT OUTER JOIN income_logs 
            ON income_categories.id = income_logs.income_category_id 
            AND income_logs.user_id = #{current_v1_user.id}
            AND income_logs.date BETWEEN '#{month}' AND '#{end_month}'
          SQL
        )
        # .group(
        #   'expense_categories.id, expense_categories.name, budgets.budget, budgets.month'
        # )
        .group(
          'income_categories.id, income_categories.name'
        )
        .order('income_categories.id ASC')
        render json: totalIncome , status: :ok
      else
        totalExpense = ExpenseCategory
        .select(
          'expense_categories.id',
          'expense_categories.name',
          'COALESCE(SUM(expense_logs.amount), 0) AS current_month_amount',
          # 'budgets.budget',
          # 'budgets.month'
        )
        .joins(
          <<~SQL
            LEFT OUTER JOIN expense_logs 
            ON expense_categories.id = expense_logs.expense_category_id 
            AND expense_logs.user_id = #{current_v1_user.id}
            AND expense_logs.date BETWEEN '#{month}' AND '#{end_month}'
          SQL
        )
        # .group(
        #   'expense_categories.id, expense_categories.name, budgets.budget, budgets.month'
        # )
        .group(
          'expense_categories.id, expense_categories.name'
        )
        .order('expense_categories.id ASC')
        render json: totalExpense , status: :ok
      end  
  end

  def gauge
    # yyyy-mm-ddの形でフロントから取得
    set_month = params[:month]
    date = Date.strptime(set_month, '%Y-%m-%d') # 文字列をDate型に変換
    first_month = (date - 0.month).beginning_of_month # (例： "2024-11-01")
    end_month = (date - 0.month).end_of_month # # (例： "2024-11-30")

    # 今月の予算&今月の支出を取得
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
    # 今月の支出合計
    total_expense = budgets.sum { |b| b.last_month_expense.to_i }
    # 総予算と支出実績の割合
    total_ratio = total_expense.to_f / total_budget.to_f * 100
  
    render json: {
      budgets: budgets,
      total_budget: total_budget,
      total_expense: total_expense,
      total_ratio: total_ratio.to_i
    }, status: :ok
  end
end
