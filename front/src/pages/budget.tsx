import Header from "@/components/header";
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
import { fetchCategory } from "@/utils/auth/fetchCategory";
import { fetchBudget } from "@/utils/auth/fetchBudget";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// expense_categoryの型定義
interface CategoryData {
  id: number;
  name: string;
}

// テーブルの行データの型定義
interface TableRowData {
  id: number;
  category: string;
  lastMonthExpense: number;
  budget: string; // 値を文字列で管理（フォーマット用）
}

// budgetの型定義
// interface BudgetData {
//   id: number;
//   expense_category_id: number;
//   budget: number;
// }

const cookies = parseCookies();
const accessToken = cookies["accessToken"];
const client = cookies["client"];
const uid = cookies["uid"];


export default function Budget() {
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
      // Rails APIからカテゴリを取得
    const fetchCategoryData = async () => {
      try {
        const data: CategoryData[] = await fetchCategory();
        const formattedData: TableRowData[] = data.map((item) => ({
          id: item.id,
          category: item.name,
          lastMonthExpense: 0,
          budget: "",
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };

      // Rails APIから設定された予算を取得
      const fetchBudgetData = async () => {
        try {
          const data = await fetchBudget();
          console.log(data);
        } catch (error) {
          console.error("取得失敗", error);
        }
      };

      // Rails APIから先月の実績を取得
    // const lastMonthExpenses = async () => {
    //   try {
    //     const data: CategoryData[] = await fetchCategory();
    //     const formattedData: TableRowData[] = data.map((item) => ({
    //       id: item.id,
    //       category: item.name,
    //       lastMonthExpense: 0,
    //       budget: "",
    //     }));
    //     setRows(formattedData);
    //   } catch (error) {
    //     console.error("取得失敗", error);
    //   }
    // };

    fetchCategoryData();
    fetchBudgetData();
  }, []);

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
    const updatedRows = [...rows];
    updatedRows[index].budget = newValue;
    setRows(updatedRows);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    // railsAPI_予算の登録
    const budgetsToSave = rows.map((row, index) => ({
      expense_category_id: rows[index].id, // カテゴリID
      budget: Number(row.budget.replace(/[^0-9]/g, "")), // 数字のみを抽出
      month: apiFormattedDate,
    }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/budgets`,
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
        throw new Error("設定に失敗しました");
      }
      alert("設定しました");
      // window.location.reload()
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

          <Box
            sx={{
              justifyContent: "center",
              textAlign: "center",
              minHeight: "150vh",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="budget_table">
                <TableHead>
                  <TableRow>
                    <TableCell>カテゴリ</TableCell>
                    <TableCell align="right">先月の支出</TableCell>
                    <TableCell align="right">今月の予算</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.category}
                      </TableCell>
                      <TableCell align="right">
                        {row.lastMonthExpense}
                      </TableCell>
                      <TableCell align="right">
                        <Input
                          value={row.budget}
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
              登録する
            </Button>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
