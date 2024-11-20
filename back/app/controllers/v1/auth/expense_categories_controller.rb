class V1::Auth::ExpenseCategoriesController < ApplicationController
  def index
    expense_categories = ExpenseCategory.all
    render json: expense_categories
  end
end
