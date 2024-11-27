class ExpenseLog < ApplicationRecord
  belongs_to :user
  belongs_to :expense_category

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :date, presence: true
end
