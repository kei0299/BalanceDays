# 支出カテゴリーデータ
expense_categories = [
  { name: '食費' },
  { name: '日用品' },
  { name: '衣服' },
  { name: '住居費' },
  { name: '通信費' },
  { name: '美容' },
  { name: '光熱費' },
  { name: '交通費' },
  { name: '交際費' },
  { name: '教育費' },
  { name: 'その他' }
]

expense_categories.each do |category|
  ExpenseCategory.find_or_create_by(category)
end

# 収入カテゴリーデータ
income_categories = [
  { name: '給料' },
  { name: '賞与' },
  { name: '副業' },
  { name: 'その他' }
]

income_categories.each do |category|
  IncomeCategory.find_or_create_by(category)
end
