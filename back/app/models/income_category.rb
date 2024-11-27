class IncomeCategory < ApplicationRecord
  validates :name, presence: true, uniqueness: true
end
