class Budget < ApplicationRecord
  belongs_to :user
  belongs_to :expense_category
  # validates :user_id, uniqueness: { scope: [:month, :category_id]}
end
