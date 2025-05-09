# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_02_02_125029) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "budgets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "expense_category_id", null: false
    t.integer "budget", default: 0, null: false
    t.date "month", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_category_id"], name: "index_budgets_on_expense_category_id"
    t.index ["user_id"], name: "index_budgets_on_user_id"
  end

  create_table "expense_categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_expense_categories_on_name", unique: true
  end

  create_table "expense_logs", force: :cascade do |t|
    t.integer "amount", null: false
    t.bigint "user_id", null: false
    t.bigint "expense_category_id", null: false
    t.date "date", null: false
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_category_id"], name: "index_expense_logs_on_expense_category_id"
    t.index ["user_id"], name: "index_expense_logs_on_user_id"
  end

  create_table "income_categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_income_categories_on_name", unique: true
  end

  create_table "income_logs", force: :cascade do |t|
    t.integer "amount", null: false
    t.bigint "user_id", null: false
    t.bigint "income_category_id", null: false
    t.date "date", null: false
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["income_category_id"], name: "index_income_logs_on_income_category_id"
    t.index ["user_id"], name: "index_income_logs_on_user_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.integer "hourly_wage", null: false
    t.integer "night_wage", default: 0
    t.integer "training_wage", default: 0
    t.date "training_start"
    t.date "training_end"
    t.string "closing_day", null: false
    t.string "payout_day", null: false
    t.string "payout_month_type", null: false
    t.bigint "income_category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "training_time", default: 0
    t.integer "training_settings", default: 0, null: false
    t.index ["income_category_id"], name: "index_jobs_on_income_category_id"
    t.index ["user_id", "name"], name: "index_jobs_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_jobs_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.integer "break_time", default: 0, null: false
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["job_id"], name: "index_shifts_on_job_id"
    t.index ["user_id"], name: "index_shifts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "email"
    t.integer "balance"
    t.date "delete_at"
    t.integer "chara_status"
    t.integer "caution_lv"
    t.integer "warning_lv"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "budgets", "expense_categories"
  add_foreign_key "budgets", "users"
  add_foreign_key "expense_logs", "expense_categories"
  add_foreign_key "expense_logs", "users"
  add_foreign_key "income_logs", "income_categories"
  add_foreign_key "income_logs", "users"
  add_foreign_key "jobs", "income_categories"
  add_foreign_key "jobs", "users"
  add_foreign_key "shifts", "jobs"
  add_foreign_key "shifts", "users"
end
