class V1::Income::IncomeCategoriesController < ApplicationController
  def index
    income_categories = IncomeCategory.all
    render json: income_categories
  end
end
