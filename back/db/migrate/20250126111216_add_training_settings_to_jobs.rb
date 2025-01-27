class AddTrainingSettingsToJobs < ActiveRecord::Migration[7.2]
  def change
    add_column :jobs, :training_settings, :integer, default: 0, null: false
  end
end
