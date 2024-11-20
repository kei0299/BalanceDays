import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { fetchCategory } from "@/utils/auth/fetchCategory";

// APIデータの型定義
interface CategoryData {
  id: number;        // 各カテゴリのID
  name: string;      // カテゴリ名
}

// テーブルの行データの型定義
interface TableRowData {
  category: string;         // カテゴリ名
  lastMonthExpense: number; // 先月の支出
  budget: number;           // 今月の予算
}

export default function Budget() {
  const [rows, setRows] = useState<TableRowData[]>([]);

  // Rails APIからカテゴリを取得
  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchCategoryData = async () => {
      try {
        const data: CategoryData[] = await fetchCategory(); // fetchCategoryの結果を取得
        const formattedData: TableRowData[] = data.map((item) => ({
          category: item.name, // APIから取得したカテゴリ名
          lastMonthExpense: 0, // 初期値として0
          budget: 0,           // 初期値として0
        }));
        setRows(formattedData); // rowsにデータをセット
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchCategoryData(); // 初回レンダリング時にセッション情報を取得
  }, []);

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
              flexDirection: "column",
              mt: 10,
              textAlign: "center",
            }}
          >
            <h1>2024年10月</h1>
          </Box>

          <Box
            sx={{
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 300, maxWidth: 500 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>カテゴリ</TableCell>
                    <TableCell align="right">先月の支出</TableCell>
                    <TableCell align="right">今月の予算</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row,index) => (
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
                      <TableCell align="right">{row.budget}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
