import Header from "@/components/headerLogin";
import FooterLogin from "@/components/footerLogin";
import { Box, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import * as React from "react";
import { NumericFormat } from "react-number-format";
import { parseCookies } from "nookies";
import Input from "@mui/joy/Input";
import { fetchBudget } from "@/utils/auth/fetchBudget";
import { fetchBudgetSum } from "@/utils/auth/fetchBudgetSum";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

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

const cookies = parseCookies();
const accessToken = cookies["accessToken"];
const client = cookies["client"];
const uid = cookies["uid"];

export default function Budget() {
  const [budgets, setBudgets] = useState<BudgetRowData[]>([]);
  const [sumBudget, setSumBudget] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    // Rails APIからカテゴリを取得
    const fetchBudgetData = async () => {
      try {
        const data: expenseData[] = await fetchBudget(apiFormattedDate);
        const formattedData: BudgetRowData[] = data.map((item) => ({
          id: item.id,
          category: item.name,
          lastMonthExpense: item.last_month_expense,
          budget: String(item.budget),
          currentMonth: String(item.currentMonth),
        }));
        const sumData: string = await fetchBudgetSum(apiFormattedDate);
        setBudgets(formattedData);
        setSumBudget(sumData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };
    fetchBudgetData();
  }, [currentMonth]);
  

  const monthChange = (direction: "previous" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "previous") {
      newMonth.setMonth(currentMonth.getMonth() - 1); // 前月
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1); // 次月
    }
    setCurrentMonth(newMonth);
  };

  // 年月を "YYYY年MM月" の形式にフォーマット
  const formattedMonth = `${currentMonth.getFullYear()}年${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}月`;

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  const budgetChange = (index: number, newValue: string) => {
    const updatedRows = [...budgets];
    updatedRows[index].budget = newValue;
    setBudgets(updatedRows);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    // railsAPI_予算の登録
    const budgetsToSave = budgets.map((row, index) => ({
      expense_category_id: budgets[index].id,
      budget: Number(row.budget.replace(/[^0-9]/g, "")),
      month: apiFormattedDate,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/budgets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({ budgets: budgetsToSave }),
        }
      );

      if (!response.ok) {
        throw new Error("予算の登録に失敗しました");
      }
      alert("予算を登録しました");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <Box
            sx={{
              display: "flex",
              mt: 10,
              textAlign: "center",
            }}
          >
            <KeyboardArrowLeftIcon onClick={() => monthChange("previous")} />
            {formattedMonth}
            <KeyboardArrowRightIcon onClick={() => monthChange("next")} />
          </Box>
          <Box sx={{mr:10, textAlign: "right"}}>
              <h2>今月の予算合計：￥{sumBudget}</h2>
            </Box>

          <Box
            sx={{
              justifyContent: "center",
              textAlign: "center",
              minHeight: "125vh",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="budget_table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>カテゴリ</TableCell>
                    <TableCell align="right">先月の支出</TableCell>
                    <TableCell align="right">今月の予算</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budgets.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell></TableCell>
                      <TableCell component="th">{row.category}</TableCell>
                      <TableCell align="right">
                        <NumericFormat
                          value={row.lastMonthExpense}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="¥"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Input
                          sx={{ maxWidth: 100, ml: "auto" }}
                          placeholder="¥10,000"
                          value={row.budget === "0" ? "" : row.budget}
                          onChange={(event) =>
                            budgetChange(index, event.target.value)
                          }
                          slotProps={{
                            input: {
                              component: NumericFormat,
                              thousandSeparator: true,
                              valueIsNumericString: true,
                              prefix: "¥",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              sx={{ mt: 7 }}
              type="submit"
              variant="outlined"
              onClick={handleSave}
            >
              予算を登録する
            </Button>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
