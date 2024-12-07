class V1::CharactersController < ApplicationController
  before_action :authenticate_v1_user!

  def index
    set_month = request.headers['currentMonth'] # フロントから取得（例: "2024-12-01"）
    date = Date.strptime(set_month, '%Y-%m-%d') # 文字列をDate型に変換
    first_month = (date - 12.month).beginning_of_month # (例： "2023-12-01")
    end_month = (date - 1.month).end_of_month # # (例： "2024-11-30")

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
      AND budgets.month BETWEEN '#{first_month}' AND '#{end_month}'
      AND budgets.user_id = #{current_v1_user.id}
    SQL
    )
    .group('budgets.month')

    # 合計して取得したavg_budgetsの数で割る
    if avg_budgets.any?
      avg_budget = avg_budgets.sum { |b| b.total_budget.to_i } / avg_budgets.size.to_i

      # キャラクターをユーザーテーブルに登録
      user = User.find_by(id: current_v1_user)

      if user && user.balance && user.warning_lv && user.caution_lv
        chara_status = user.update_character_status!(avg_budget,user)
      end
  
    end
  
    render json: chara_status, status: :ok
  end

end
