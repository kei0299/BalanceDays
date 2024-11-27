class CreateIncomeCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :income_categories do |t|
      t.string :name,null: false

      t.timestamps
    end
    add_index :income_categories, :name, unique: true
  end
end
