import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import Typography from "@mui/material/Typography";
import { parseCookies } from "nookies";
import { Gauge } from "@mui/x-charts/Gauge";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";


export default function HomeTotalGauge() {
  const [currentMonth] = useState<Date>(new Date());
  const [totalBudget, setTotalBudget] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [totalRatio, setTotalRatio] = useState<number>(0);

  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const client = cookies["client"];
  const uid = cookies["uid"];

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
    fetchGauge();
  }, []);

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
