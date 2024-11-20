class ExpenseCategory < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :budgets
end
