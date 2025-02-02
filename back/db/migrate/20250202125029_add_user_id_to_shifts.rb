class AddUserIdToShifts < ActiveRecord::Migration[7.2]
  def change
    add_reference :shifts, :user, null: false, foreign_key: true
  end
end
