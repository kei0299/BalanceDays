class V1::Auth::BudgetsController < ApplicationController
  before_action :authenticate_v1_user!

  def create
    budgets = budget_params

    Budget.transaction do
      budgets.each do |budget_params|
        Budget.create!(
          user_id: current_v1_user.id,
          expense_category_id: budget_params[:expense_category_id],
          budget: budget_params[:budget],
          month: budget_params[:month]
        )
      end
    end

    render json: { message: "予算を保存しました" }, status: :ok
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def budget_params
    params.require(:budgets).map do |budget|
      budget.permit(:expense_category_id, :budget, :month)
    end
  end
end
