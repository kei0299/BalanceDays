import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { fetchIncomeCategory } from "@/utils/auth/fetchIncomeCategory";
import { fetchExpenseCategory } from "@/utils/auth/fetchExpenseCategory";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { parseCookies } from "nookies";

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
  category: string;
  memo: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Calender() {
  // 金額入力フォーム
  const [incomeAmount, setIncomeAmount] = React.useState("");
  const [expenseAmount, setExpenseAmount] = React.useState("");

  // tabの状態管理
  const [tab, setTab] = React.useState(0);
  const [day, setDay] = React.useState<Dayjs | null>(dayjs());

  // カテゴリセット
  const [incomeCategory, setIncomeCategory] = useState<number | "">("");
  const [expenseCategory, setExpenseCategory] = useState<number | "">("");
  const [incomeCategories, setIncomeCategories] = useState<incomeCategoryData[]>([]); // カテゴリデータ用のstate
  const [expenseCategories, setExpenseCategories] = useState<expenseCategoryData[]>([]); // カテゴリデータ用のstate

  const selectIncomeCategory = (event: SelectChangeEvent<number>) => {
    setIncomeCategory(Number(event.target.value));
  };

  const selectExpenseCategory = (event: SelectChangeEvent<number>) => {
    setExpenseCategory(Number(event.target.value));
  };

// メモ
const [incomeMemo, setIncomeMemo] = React.useState<string>("");
const [expenseMemo, setExpenseMemo] = React.useState<string>("");

const expenseMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setExpenseMemo(event.target.value);
};

const incomeMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setIncomeMemo(event.target.value);
};
  
// カレンダーのデータ取得
const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
const [transactions, setTransactions] = useState<TransactionData[]>([]);
const [loading, setLoading] = useState(false);

const dateChange = async (date: Dayjs | null) => {
  if (!date) return;

  setSelectedDate(date);
  setLoading(true);

  try {
    // APIリクエストを送信
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/transactions?date=${date.format(
        "YYYY-MM-DD"
      )}`
    );

    if (!response.ok) {
      throw new Error("データ取得に失敗しました");
    }

    const data: TransactionData[] = await response.json();
    setTransactions(data); // 取得したデータをstateに保存
  } catch (error) {
    console.error("エラー:", error);
  } finally {
    setLoading(false);
  }
};

// menuitemの設定
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP, // メニューの最大高さ
      },
    },
  };

  const tabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  // 金額をフォーマットする関数
  const formatAmountChange = <T extends HTMLInputElement | HTMLTextAreaElement>(
    event: React.ChangeEvent<T>,
    setAmount: React.Dispatch<React.SetStateAction<string>>) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, ""); // 数字以外を削除
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 3桁ごとにカンマを挿入
    setAmount(formattedValue); // カンマ区切りを適用して状態を更新
  };

  // railsAPI_支出の登録
  const expenseSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/expense_log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            amount: Number(expenseAmount.replace(/,/g, "")),
            date: day,
            expense_category_id: expenseCategory,
            memo: expenseMemo
          }),
        }
      );

      if (!response.ok) {
        throw new Error("支出の記録に失敗しました");
      }
      alert("支出を記録しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // railsAPI_収入の登録
  const incomeSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/income_log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            amount: Number(incomeAmount.replace(/,/g, "")),
            date: day,
            income_category_id: incomeCategory,
            memo: incomeMemo
          }),
        }
      );

      if (!response.ok) {
        throw new Error("収入の記録に失敗しました");
      }
      alert("収入を記録しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Rails APIからカテゴリを取得
    const fetchCategoryData = async () => {
      try {
        const incomeData: incomeCategoryData[] = await fetchIncomeCategory();
        setIncomeCategories(incomeData);

        const expenseData: expenseCategoryData[] = await fetchExpenseCategory();
        setExpenseCategories(expenseData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        {/* <main style={{ minHeight: "300vh" }}> */}
        <main>
          <Box sx={{ mt: 10, mr: 1000 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar onChange={dateChange}/>
            </LocalizationProvider>
          </Box>

          {selectedDate && (
        <Box sx={{ mt: 2 }}>
          <h2>{selectedDate.format("YYYY/MM/DD")}の収支データ</h2>
          {loading ? (
            <p>読み込み中...</p>
          ) : transactions.length > 0 ? (
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <strong>
                    {transaction.type === "income" ? "収入" : "支出"}
                  </strong>
                  : ¥{transaction.amount.toLocaleString()} - {transaction.category}{" "}
                  ({transaction.memo})
                </li>
              ))}
            </ul>
          ) : (
            <p>データがありません。</p>
          )}
        </Box>
      )}


          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tab} onChange={tabChange} aria-label="tabChanges">
                <Tab label="収入" {...a11yProps(0)} />
                <Tab label="支出" {...a11yProps(1)} />
                <Tab label="シフト" {...a11yProps(1)} />
              </Tabs>
            </Box>

            {/* 収入タブ */}
            <CustomTabPanel value={tab} index={0}>
              {/* 日付入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="日付"
                  value={day}
                  onChange={(newDay) => setDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* カテゴリ選択 */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel id="income-category-label">カテゴリ</InputLabel>
                <Select
                  labelId="income-category-label"
                  id="income-select"
                  value={incomeCategory}
                  label="カテゴリ"
                  onChange={selectIncomeCategory}
                >
                  {incomeCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name} {/* APIから取得したカテゴリ名 */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 金額入力フォーム */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel htmlFor="outlined-incomeAmount">金額</InputLabel>
                <OutlinedInput
                  id="outlined-incomeAmount"
                  label="金額"
                  value={incomeAmount}
                  onChange={(event) => formatAmountChange(event, setIncomeAmount)}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>

              {/* メモ */}
              <TextField
                sx={{ ml: 2 }}
                id="outlined-multiline-flexible"
                label="メモ"
                multiline
                maxRows={4}
                value={incomeMemo}
                onChange={incomeMemoChange}
              />

              {/* ボタン */}
              <Box sx={{ display: "flex", mt: 2 }}>
                <Button type="submit" variant="outlined" onClick={incomeSave}>
                  登録する
                </Button>
              </Box>
            </CustomTabPanel>

            {/* // 支出タブ */}
            <CustomTabPanel value={tab} index={1}>
              {/* 日付入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="日付"
                  value={day}
                  onChange={(newDay) => setDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* カテゴリ選択 */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel id="income-category-label">カテゴリ</InputLabel>
                <Select
                  labelId="income-category-label"
                  id="income-select"
                  value={expenseCategory}
                  label="カテゴリ"
                  onChange={selectExpenseCategory}
                  MenuProps={MenuProps}
                >
                  {expenseCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name} {/* APIから取得したカテゴリ名 */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 金額入力フォーム */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel htmlFor="outlined-incomeAmount">金額</InputLabel>
                <OutlinedInput
                  id="outlined-incomeAmount"
                  label="金額"
                  value={expenseAmount}
                  onChange={(event) => formatAmountChange(event, setExpenseAmount)}
                  startAdornment={
                    <InputAdornment position="start">¥</InputAdornment>
                  }
                  inputProps={{ inputMode: "numeric" }} // モバイルのみ数字キーボードを表示
                />
              </FormControl>

              {/* メモ */}
              <TextField
                sx={{ ml: 2 }}
                id="outlined-multiline-flexible"
                label="メモ"
                multiline
                maxRows={4}
                value={expenseMemo}
                onChange={expenseMemoChange}
              />

              {/* ボタン */}
              <Box sx={{ display: "flex", mt: 2 }}>
                <Button type="submit" variant="outlined" onClick={expenseSave}>
                  登録する
                </Button>
              </Box>
            </CustomTabPanel>

            {/* // シフト */}
            <CustomTabPanel value={tab} index={2}>
              シフト
            </CustomTabPanel>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
