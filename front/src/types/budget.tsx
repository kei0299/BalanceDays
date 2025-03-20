// API用の型定義
interface expenseData {
  id: number;
  name: string;
  budget: number;
  last_month_expense: number;
  currentMonth: string;
}

// テーブルの行データ用の型定義
interface BudgetRowData {
  id: number;
  budget: string; // 値を文字列で管理（フォーマット用）
  category: string;
  lastMonthExpense: number;
  currentMonth: string;
}