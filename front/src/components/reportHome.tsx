import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import React from "react";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { parseCookies } from "nookies";
import { Gauge } from "@mui/x-charts/Gauge";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

// 円グラフ用の型定義
interface pieChartData {
  id: number;
  current_month_amount: number;
  name: string;
}

export default function ReportHome() {
  const [currentMonth] = useState<Date>(new Date());
  const [checked, setChecked] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);

  const [totalRatio, setTotalRatio] = useState<number>(0);

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const client = cookies["client"];
  const uid = cookies["uid"];

  // Rails APIから円チャートを作成
  const fetchPieChart = async (isChecked: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reports/pie_chart?month=${apiFormattedDate}&checked=${isChecked}`, // クエリパラメータとして送信
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
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();

      // カテゴリごとに色を指定（ここでは例として色を手動で設定）
      const colors = [
        "#4682b4",
        "#FFCE56",
        "#4BC0C0",
        "#FF9F40",
        "#9966FF",
        "#FFB6C1",
        "#2e8b57",
        "#FF6384",
        "#8A2BE2",
        "#FFD700",
        "#8B0000",
      ];

      // APIレスポンスを PieChart に渡す形式に変換
      const pieChartData = data.map((item: pieChartData, index: number) => ({
        id: item.id,
        value: item.current_month_amount,
        label: item.name,
        color: colors[index % colors.length],
      }));
      setExpenses(pieChartData);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  // Rails APIから予算ゲージを作成
  const fetchGauge = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/reports/total_gauge?month=${apiFormattedDate}`,
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
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();

      setTotalBudget(data.total_budget);
      setTotalExpense(data.total_expense);
      setTotalRatio(data.total_ratio);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  useEffect(() => {
    fetchPieChart(checked);
    fetchGauge();
  }, []);

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  const switchToggle = () => {
    const newChecked = !checked; // スイッチの新しい状態
    setChecked(newChecked);
    fetchPieChart(newChecked); // スイッチの状態を渡してデータ取得
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 円グラフ */}
        <Stack
          spacing={3}
          direction="column"
          alignItems="center"
          sx={{ mt: 6 }}
        >
          <Stack spacing={2} direction="row" alignItems="center" sx={{ mt: 6 }}>
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              カテゴリ別収支レポート（￥）
            </Typography>
            <Link
              href="report"
              sx={{
                color: "gray",
                textDecoration: "none",
                fontSize: "14px",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              詳しく見る→
            </Link>
          </Stack>
          <PieChart series={[{ data: expenses }]} width={500} height={200} />

          {/* スイッチ */}
          <Box display="flex" alignItems="center" gap={1} marginTop={1}>
            <Typography
              sx={{
                color: checked ? "gray" : "red", // オフ時は赤、オン時は灰色
                fontWeight: !checked ? "bold" : "normal", // オフ時は太字
                fontSize: "15px",
              }}
            >
              支出
            </Typography>
            <Switch
              checked={checked}
              onChange={checkedChange}
              onClick={switchToggle}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: checked ? "blue" : "red", // トラックの色
                },
              }}
            />
            <Typography
              sx={{
                color: checked ? "blue" : "gray", // オン時は緑、オフ時は灰色
                fontWeight: checked ? "bold" : "normal", // オン時は太字
                fontSize: "15px",
              }}
            >
              収入
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2} direction="row" alignItems="center">
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              総予算（％）
            </Typography>
            <Link
              href="report"
              sx={{
                color: "gray",
                textDecoration: "none",
                fontSize: "14px",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              詳しく見る→
            </Link>
          </Stack>
        <Stack spacing={3} direction="row">
          <Stack spacing={2} direction="column">
            <Gauge width={200} height={200} value={totalRatio} />
            <Typography>
              ¥{totalExpense.toLocaleString()} / ¥{totalBudget.toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
