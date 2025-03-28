class Job < ApplicationRecord
  belongs_to :user
  belongs_to :income_category
  has_many :shifts, dependent: :destroy

  # バリデーション
  validates :name, presence: true
  validates :hourly_wage, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :closing_day, presence: true
  validates :payout_day, presence: true
  validates :payout_month_type, presence: true

  # validate :training_dates_valid?

  enum training_settings: {
    no_training: 0,        # 研修なし
    training_period: 1,    # 研修期間
    training_time: 2   # 研修時間
  }

  private

  # トレーニング開始日と終了日がどちらか一方のみ設定されている場合は無効
  # def training_dates_valid?
  #   if training_start.present? ^ training_end.present?
  #     errors.add(:training_start, "と training_end の両方を設定する必要があります")
  #   end
  # end
end
