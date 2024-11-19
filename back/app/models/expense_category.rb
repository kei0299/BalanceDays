class ExpenseCategory < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
