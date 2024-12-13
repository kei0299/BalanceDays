class V1::TransactionsController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    # クエリパラメータから日付を取得
    date = params[:date]

    # ログイン中のユーザーの収入ログを取得
    income_logs = current_v1_user.income_logs
                    .where(date: date) # 該当の日付でフィルタリング
                    .includes(:income_category) # カテゴリの情報も取得
                    .select(:id, :amount, :income_category_id, :memo, :created_at)
                    .map do |income|
      {
        id: income.id,
        type: "income",
        amount: income.amount,
        categoryId: income.income_category_id,
        category: income.income_category.name, # income_category.name でカテゴリ名を取得
        memo: income.memo || "",
        created_at: income.created_at
      }
    end

    # ログイン中のユーザーの支出ログを取得
    expense_logs = ExpenseLog
                    .where(user_id: current_v1_user.id, date: date) # ユーザーIDと日付でフィルタリング
                    .includes(:expense_category) # カテゴリの情報も取得
                    .select(:id, :amount, :expense_category_id, :memo, :created_at)
                    .map do |expense|
      {
        id: expense.id,
        type: "expense",
        amount: expense.amount,
        categoryId: expense.expense_category_id,
        category: expense.expense_category.name, # expense_category.name でカテゴリ名を取得
        memo: expense.memo || "",
        created_at: expense.created_at
      }
    end

    # 収入と支出のデータを統合して日付順にソート
    transactions = (income_logs + expense_logs).sort_by { |t| t[:created_at] }

    render json: transactions, status: :ok
  end

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

  def destroy
    transaction_id = params[:id]
    transaction_type = params[:type]

    # 振り分けだけして処理は各コントローラで行う
    if transaction_type == "income"
      income_log = IncomeLog.find_by(id: transaction_id)
      if income_log
        income_log.destroy
        render json: { message: "収入が削除されました", transaction: income_log }, status: :ok
      else
        render json: { message: "収入ログが見つかりません" }, status: :not_found
      end
    else
      expense_log = ExpenseLog.find_by(id: transaction_id)
      if expense_log
        expense_log.destroy
        render json: { message: "支出が削除されました", transaction: expense_log }, status: :ok
      else
        render json: { message: "支出ログが見つかりません" }, status: :not_found
      end
    end
  end
end
