class V1::Auth::IncomeCategoriesController < ApplicationController
  def index
    income_categories = IncomeCategory.all
    render json: income_categories
  end
end
