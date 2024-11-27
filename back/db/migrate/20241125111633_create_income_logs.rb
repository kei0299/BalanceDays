class CreateIncomeLogs < ActiveRecord::Migration[7.2]
  def change
    create_table :income_logs do |t|
      t.integer :amount, null: false
      t.references :user, foreign_key: true, null: false
      t.references :income_category, foreign_key: true, null: false
      t.date :date, null: false
      t.text :memo

      t.timestamps
    end
  end
end
