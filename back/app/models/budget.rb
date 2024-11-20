class Budget < ApplicationRecord
  belongs_to :user
  belongs_to :expense_category
end
