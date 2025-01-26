class Job < ApplicationRecord
  belongs_to :user
  belongs_to :income_category

  # バリデーション
  validates :name, presence: true
  validates :hourly_wage, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :closing_day, presence: true
  validates :payout_day, presence: true
  validates :payout_month_type, presence: true

  # validate :training_dates_valid?

  private

  # トレーニング開始日と終了日がどちらか一方のみ設定されている場合は無効
  # def training_dates_valid?
  #   if training_start.present? ^ training_end.present?
  #     errors.add(:training_start, "と training_end の両方を設定する必要があります")
  #   end
  # end
end
