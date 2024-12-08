# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User
  has_many :budgets, dependent: :destroy
  has_many :expense_logs, dependent: :destroy
  has_many :income_logs, dependent: :destroy

  def update_character_status!(avg_budget,user)
    balance = user.balance
    warning_lv = user.warning_lv
    caution_lv = user.caution_lv
    set_life = balance / avg_budget

    return unless balance && warning_lv && caution_lv

    set_chara_status =
      if warning_lv >= set_life
        3
      elsif caution_lv >= set_life
        2
      else
        1
      end

    update!(chara_status: set_chara_status)
    return set_chara_status,set_life
  
  end
end

