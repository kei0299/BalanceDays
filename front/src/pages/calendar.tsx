import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { useEffect, useState } from "react";

import { Box, IconButton, Button } from "@mui/material";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { fetchIncomeCategory } from "@/utils/auth/fetchIncomeCategory";
import { fetchExpenseCategory } from "@/utils/auth/fetchExpenseCategory";
import { fetchCompanyName } from "@/utils/auth/fetchCompanyName";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { parseCookies } from "nookies";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";

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

// 勤務先データの型定義
interface companyData {
  id: number;
  name: string;
}

const cookies = parseCookies();
const accessToken = cookies["accessToken"];
const client = cookies["client"];
const uid = cookies["uid"];

let logId: number = 0;

// Tab関連
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
  const [formDay, setFormDay] = React.useState<Dayjs | null>(dayjs()); // フォーム用の日付
  let formatFormDay: Date = new Date(); // フォーム受け渡し用の日付
  if (formDay) {
    // Dayjs型からDate型に変換
    formatFormDay = dayjs(formDay.toDate()).add(9, "hour").toDate();
  }

  // カテゴリセット
  const [incomeCategory, setIncomeCategory] = useState<number | "">("");
  const [expenseCategory, setExpenseCategory] = useState<number | "">("");
  const [incomeCategories, setIncomeCategories] = useState<
    incomeCategoryData[]
  >([]);
  const [expenseCategories, setExpenseCategories] = useState<
    expenseCategoryData[]
  >([]);

  // シフト関連
  const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T10:00'));
  const [endTime, setEndTime] = React.useState<Dayjs | null>(dayjs('2022-04-17T20:00'));
  const [companyName, setCompanyName] = useState<number | "">("");
  const [company, setCompany] = useState<companyData[]>([]); // 勤務先データ用のstate
  const [breakTime, setBreakTime] = React.useState<number>(0);
  const [workStartDay, setWorkStartDay] = React.useState<Dayjs | null>();
  const [workEndDay, setWorkEndDay] = React.useState<Dayjs | null>();

  const selectIncomeCategory = (event: SelectChangeEvent<number>) => {
    setIncomeCategory(Number(event.target.value));
  };

  const selectExpenseCategory = (event: SelectChangeEvent<number>) => {
    setExpenseCategory(Number(event.target.value));
  };

  const selectCompany = (event: SelectChangeEvent<number>) => {
    setCompanyName(Number(event.target.value));
  };

  const changeBreakTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBreakTime(Number(event.target.value));
  };

  // メモ
  const [incomeMemo, setIncomeMemo] = React.useState<string>("");
  const [expenseMemo, setExpenseMemo] = React.useState<string>("");
  const [shiftMemo, setShiftMemo] = React.useState<string>("");

  const shiftMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShiftMemo(event.target.value);
  };

  const expenseMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseMemo(event.target.value);
  };

  const incomeMemoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncomeMemo(event.target.value);
  };

  // カレンダーのデータ取得
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  const dateChange = async (date: Dayjs | null) => {
    if (!date) return;

    setSelectedDate(date);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/transactions?date=${date.format(
          "YYYY-MM-DD"
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
        }
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
    setIsEditMode(false);
    setIncomeCategory("");
    setExpenseCategory("");
    setIncomeMemo("");
    setExpenseMemo("");
    setIncomeAmount("");
    setExpenseAmount("");
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
    setAmount: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, ""); // 数字以外を削除
    const formattedValue = formatNum(numericValue); // フォーマット適用
    setAmount(formattedValue); // カンマ区切りを適用して状態を更新
  };

  // 3桁ごとにカンマを挿入する関数
  const formatNum = (num: string | number): string => {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 選択した取引データをフォームに反映
  const setEditTransaction = (
    transaction: TransactionData,
    selectedDate: Dayjs
  ) => {
    logId = transaction.id;
    if (transaction.type === "income") {
      setTab(0);
      setFormDay(selectedDate);
      setIncomeCategory(transaction.categoryId); // APIのカテゴリ
      setIncomeAmount(formatNum(transaction.amount)); // 金額
      setIncomeMemo(transaction.memo); // メモ
    } else {
      setTab(1);
      setFormDay(selectedDate);
      setExpenseCategory(transaction.categoryId); // APIのカテゴリ
      setExpenseAmount(formatNum(transaction.amount)); // 金額
      setExpenseMemo(transaction.memo); // メモ
    }
    console.log(selectedDate);
    setIsEditMode(true);
  };

  // railsAPI_支出の登録
  const expenseSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/expense/expense_log`,
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
            date: formatFormDay,
            expense_category_id: expenseCategory,
            memo: expenseMemo,
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
    setIsEditMode(false);
  };

  // railsAPI_支出の更新
  const expenseEditSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/expense/expense_log/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            amount: Number(expenseAmount.replace(/,/g, "")),
            date: formatFormDay,
            expense_category_id: expenseCategory,
            memo: expenseMemo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("支出ログの更新に失敗しました");
      }
      alert("支出ログを更新しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    setIsEditMode(false);
  };

  // railsAPI_収入の登録
  const incomeSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/income/income_log`,
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
            date: formatFormDay,
            income_category_id: incomeCategory,
            memo: incomeMemo,
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
    setIsEditMode(false);
  };

  // railsAPI_収入の更新
  const incomeEditSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/income/income_log/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            amount: Number(incomeAmount.replace(/,/g, "")),
            date: formatFormDay,
            income_category_id: incomeCategory,
            memo: incomeMemo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("収入ログの更新に失敗しました");
      }
      alert("収入ログを更新しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    setIsEditMode(false);
  };

  // railsAPI_収支の削除
  const transactionDelete = async (
    transactionId: number,
    transactionType: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            id: transactionId,
            type: transactionType,
          }),
        }
      );
      if (!response.ok) {
        // 失敗した場合、エラーメッセージを表示
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`削除に失敗しました: ${errorData.error || "不明なエラー"}`);
        return;
      }

      // 成功した場合、通知
      const data = await response.json();
      alert(data.message || "削除完了");

      // ページをリロードして反映
      window.location.reload();
    } catch (error) {
      // ネットワークエラーやその他のエラーをキャッチ
      console.error("Network Error:", error);
      alert("エラーが発生しました。再度お試しください。");
    }
  };

  // railsAPI_シフトの登録
  const shiftSave = async (event: React.FormEvent) => {
    event.preventDefault();

    // 勤務終了日が入力されていない場合、勤務開始日を適用
    const finalEndDay = workEndDay || workStartDay;

    // 日付と時間を結合して "YYYY-MM-DDTHH:MM:00" の形式にする
    const startDateTime = `${dayjs(workStartDay).format("YYYY-MM-DD")}T${dayjs(
      startTime,
      "HH:mm"
    ).format("HH:mm")}:00`;

    const endDateTime = `${dayjs(finalEndDay).format("YYYY-MM-DD")}T${dayjs(
      endTime,
      "HH:mm"
    ).format("HH:mm")}:00`;

    const shiftData = {
      job_id: companyName,
      start_time: startDateTime,
      end_time: endDateTime,
      break_time: breakTime,
      memo: shiftMemo,
    };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/shifts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "access-token": accessToken,
              client: client,
              uid: uid,
            },
            body: JSON.stringify({ shift: shiftData }),
          }
        );

        if (!response.ok) {
          throw new Error("シフトの登録に失敗しました");
        }
        alert("シフトを登録しました");
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
      setIsEditMode(false);
  };

  // railsAPI_シフトの更新
  const shiftEditSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/shift/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            amount: Number(expenseAmount.replace(/,/g, "")),
            date: formatFormDay,
            expense_category_id: expenseCategory,
            memo: expenseMemo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("支出ログの更新に失敗しました");
      }
      alert("支出ログを更新しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    setIsEditMode(false);
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

    // Rails APIから勤務先データを取得
    const fetchCompanyData = async () => {
      try {
        const companyData: companyData[] = await fetchCompanyName();
        setCompany(companyData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };
    fetchCompanyData();
    fetchCategoryData();
    dateChange(dayjs());
  }, []);

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main style={{ minHeight: "115vh" }}>
          {/* <main> */}
          <div style={{ display: "flex", marginTop: "80px" }}>
            <Box sx={{ mt: 0 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar onChange={dateChange} />
              </LocalizationProvider>
            </Box>

            {selectedDate && (
              <Box sx={{ mb: 20, ml: 5 }}>
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
                        : ¥{transaction.amount.toLocaleString()} -{" "}
                        {transaction.category} ({transaction.memo})
                        <IconButton
                          sx={{ ml: 1 }}
                          aria-label="edit"
                          size="small"
                          onClick={() =>
                            setEditTransaction(transaction, selectedDate)
                          } // 編集モードに切り替え
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() =>
                            transactionDelete(transaction.id, transaction.type)
                          }
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>データがありません。</p>
                )}
              </Box>
            )}
          </div>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tab} onChange={tabChange} aria-label="tabChanges">
                <Tab label="収入" {...a11yProps(0)} />
                <Tab label="支出" {...a11yProps(1)} />
                <Tab label="シフト" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* 収入タブ */}
            <CustomTabPanel value={tab} index={0}>
              {/* 日付入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="日付"
                  value={formDay}
                  onChange={(newDay) => setFormDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* カテゴリ選択 */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel>カテゴリ</InputLabel>
                <Select
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
                  onChange={(event) =>
                    formatAmountChange(event, setIncomeAmount)
                  }
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
                <Button
                  type="submit"
                  variant="outlined"
                  onClick={isEditMode ? incomeEditSave : incomeSave}
                >
                  {isEditMode ? "更新する" : "登録する"}
                </Button>
              </Box>
            </CustomTabPanel>

            {/* // 支出タブ */}
            <CustomTabPanel value={tab} index={1}>
              {/* 日付入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="日付"
                  value={formDay}
                  onChange={(newDay) => setFormDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* カテゴリ選択 */}
              <FormControl sx={{ minWidth: 150, ml: 2 }}>
                <InputLabel>カテゴリ</InputLabel>
                <Select
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
                  onChange={(event) =>
                    formatAmountChange(event, setExpenseAmount)
                  }
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
                <Button
                  type="submit"
                  variant="outlined"
                  onClick={isEditMode ? expenseEditSave : expenseSave}
                >
                  {isEditMode ? "更新する" : "登録する"}
                </Button>
              </Box>
            </CustomTabPanel>

            {/* // シフト */}
            <CustomTabPanel value={tab} index={2}>
              <FormControl sx={{ minWidth: 200, m: 2 }}>
                <InputLabel id="label-CompanyName">勤務先</InputLabel>
                <Select
                  labelId="label-CompanyName"
                  id="company-name"
                  value={companyName}
                  label="勤務先"
                  onChange={selectCompany}
                >
                  {company.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name} {/* APIから取得したカテゴリ名 */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 勤務開始日入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ minWidth: 130, m: 2 }}
                  label="勤務開始日"
                  value={workStartDay}
                  onChange={(newDay) => setWorkStartDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* 勤務終了日入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ minWidth: 130, m: 2 }}
                  label="勤務終了日"
                  value={workEndDay}
                  onChange={(newDay) => setWorkEndDay(newDay)}
                  format="YYYY/MM/DD"
                />
              </LocalizationProvider>

              {/* シフト開始入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  sx={{ minWidth: 130, m: 2 }}
                  label="勤務開始時間"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                />
              </LocalizationProvider>

              {/* シフト終了入力フォーム */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  sx={{ minWidth: 130, m: 2 }}
                  label="勤務終了時間"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                />
              </LocalizationProvider>

              {/* 休憩時間 */}
              <TextField
                sx={{ minWidth: 150, m: 2 }}
                id="break-time"
                label="休憩時間(h)"
                value={breakTime}
                onChange={changeBreakTime}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* メモ */}
              <TextField
                sx={{ m: 2 }}
                id="shift-memo"
                label="メモ"
                multiline
                maxRows={4}
                value={shiftMemo}
                onChange={shiftMemoChange}
              />

              {/* ボタン */}
              <Box sx={{ display: "flex", m: 2 }}>
                <Button
                  type="submit"
                  variant="outlined"
                  onClick={isEditMode ? shiftEditSave : shiftSave}
                >
                  {isEditMode ? "更新する" : "登録する"}
                </Button>
              </Box>
            </CustomTabPanel>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
