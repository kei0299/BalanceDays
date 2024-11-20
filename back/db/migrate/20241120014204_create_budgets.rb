class CreateBudgets < ActiveRecord::Migration[7.2]
  def change
    create_table :budgets do |t|
      t.references :user, foreign_key: true, null: false
      t.references :expense_category, foreign_key: true, null: false
      t.integer :budget, null: false, default: 0
      t.date :month, null: false

      t.timestamps
    end
  end
end
