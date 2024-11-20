import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import * as React from "react";
import { NumericFormat } from 'react-number-format';
import Input from '@mui/joy/Input';
import { fetchCategory } from "@/utils/auth/fetchCategory";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// APIデータの型定義
interface CategoryData {
  id: number; // 各カテゴリのID
  name: string; // カテゴリ名
}

// テーブルの行データの型定義
interface TableRowData {
  category: string; // カテゴリ名
  lastMonthExpense: number; // 先月の支出
  budget: number; // 今月の予算
}

export default function Budget() {
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [value, setValue] = React.useState("");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Rails APIからカテゴリを取得
  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchCategoryData = async () => {
      try {
        const data: CategoryData[] = await fetchCategory(); // fetchCategoryの結果を取得
        const formattedData: TableRowData[] = data.map((item) => ({
          category: item.name, // APIから取得したカテゴリ名
          lastMonthExpense: 0, // 初期値として0
          budget: 0, // 初期値として0
        }));
        setRows(formattedData); // rowsにデータをセット
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchCategoryData(); // 初回レンダリング時にセッション情報を取得
  }, []);

  const handleMonthChange = (direction: "previous" | "next") => {
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
            <KeyboardArrowLeftIcon
              onClick={() => handleMonthChange("previous")}
            />
            {formattedMonth}
            <KeyboardArrowRightIcon onClick={() => handleMonthChange("next")} />
          </Box>

          <Box
            sx={{
              justifyContent: "center",
              textAlign: "center",
              minHeight: "100vh",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 300, maxWidth: 800 }}
                aria-label="budget_table"
              >
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
                        <TextField
                          type="number"
                          value={row.budget}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].budget = Number(e.target.value);
                            setRows(updatedRows); // 新しい状態でrowsを更新
                          }}
                          fullWidth
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      // NumericFormat を直接 component に指定
      slotProps={{
        input: {
          component: NumericFormat,
          thousandSeparator: true,
          valueIsNumericString: true,
          prefix: "¥",
        },
      }}
    />

        </main>
        <FooterLogin />
      </div>
    </>
  );
}
