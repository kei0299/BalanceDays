class CreateJobs < ActiveRecord::Migration[7.2]
  def change
    create_table :jobs do |t|
      t.references :user, foreign_key: true, null: false
      t.string :name, null: false
      t.integer :hourly_wage, null: false
      t.integer :night_wage, default: 0
      t.integer :training_wage, default: 0
      t.date :training_start
      t.date :training_end
      t.string :closing_day, null: false
      t.string :payout_day, null: false
      t.string :payout_month_type, null: false
      t.references :income_category, foreign_key: true, null: false

      t.timestamps
    end

    # ユニーク制約を追加（ジョブ名が同じユーザー内で重複しないようにする）
    add_index :jobs, [:user_id, :name], unique: true
  end
end
