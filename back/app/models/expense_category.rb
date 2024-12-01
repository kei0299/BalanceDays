class ExpenseCategory < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :budgets
  has_many :expense_logs
end
