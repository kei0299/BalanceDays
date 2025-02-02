class CreateShifts < ActiveRecord::Migration[7.2]
  def change
    create_table :shifts do |t|
      t.references :job, foreign_key: true, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.integer :break_time, default: 0, null: false
      t.text :memo

      t.timestamps
    end
  end
end
