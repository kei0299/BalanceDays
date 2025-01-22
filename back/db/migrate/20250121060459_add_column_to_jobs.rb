class AddColumnToJobs < ActiveRecord::Migration[7.2]
  def change
    add_column :jobs, :training_time, :integer, default: 0
  end
end
