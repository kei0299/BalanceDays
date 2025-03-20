interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// income_categoryの型定義
interface incomeCategoryData {
  id: number;
  name: string;
}

// expense_categoryの型定義
interface expenseCategoryData {
  id: number;
  name: string;
}

// カレンダー日付取得の型定義
interface TransactionData {
  id: number;
  type: "income" | "expense";
  amount: number;
  categoryId: number;
  category: string;
  memo: string;
}

// シフト取得の型定義
interface shiftData {
  id: number;
  job_id: number;
  name: string;
  start_time: string;
  end_time: string;
  break_time: number;
  memo: string;
  total_salary: string;
  work_time: number;
}

// 勤務先データの型定義
interface companyData {
  id: number;
  name: string;
}