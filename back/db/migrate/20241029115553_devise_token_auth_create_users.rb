class DeviseTokenAuthCreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table(:users) do |t|
      ## Required
      t.string :provider, null: false, default: "email"
      t.string :uid, null: false, default: ""

      ## Database authenticatable
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.boolean :allow_password_change, default: false

      ## Rememberable
      t.datetime :remember_created_at

      ## Confirmable
      t.string :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string :unconfirmed_email # Only if using reconfirmable

      ## User情報
      t.string :name
      t.string :email
      t.integer :balance          # 貯金残高
      t.date :delete_at           # 削除フラグ。削除時は日付が入る
      t.integer :chara_status     # キャラクターのステータス（enumで管理）
      t.integer :caution_lv       # 注意レベル
      t.integer :warning_lv       # 警告レベル

      ## Tokens
      t.json :tokens

      t.timestamps
    end

    add_index :users, :email, unique: true
    add_index :users, [:uid, :provider], unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token, unique: true
  end
end
