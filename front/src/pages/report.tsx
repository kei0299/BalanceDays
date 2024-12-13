import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React from "react";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { parseCookies } from "nookies";

// 円グラフ用の型定義
interface pieChartData {
  id: number;
  current_month_amount: number;
  name: string;
}

export default function Report() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [checked, setChecked] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const client = cookies["client"];
  const uid = cookies["uid"];

  // Rails APIからカテゴリを取得
  const fetchTransactions = async (isChecked: boolean) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/transactions/pie_chart?month=${apiFormattedDate}&checked=${isChecked}`, // クエリパラメータとして送信
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
      console.log("取得データ:", data);

      // カテゴリごとに色を指定（ここでは例として色を手動で設定）
      const colors = [
        "#36A2EB", // 青
        "#FFCE56", // 黄
        "#4BC0C0", // 緑
        "#FF9F40", // オレンジ
        "#9966FF", // 紫
        "#FFB6C1", // ピンク
        "#00FF00", // ライムグリーン
        "#FF6384", // 赤
        "#8A2BE2", // ブルーバイオレット
        "#FFD700", // ゴールド
        "#8B0000", // ダークレッド
      ];

      // APIレスポンスを PieChart に渡す形式に変換
      const pieChartData = data.map((item: pieChartData, index: number) => ({
        id: item.id, // カテゴリのID
        value: item.current_month_amount, // 現在の月の収支
        label: item.name, // カテゴリ名
        color: colors[index % colors.length],
      }));
      setExpenses(pieChartData);
    } catch (error) {
      console.error("取得失敗", error);
    }
  };

  useEffect(() => {
    fetchTransactions(checked); // 正しい関数を呼び出す
  }, [currentMonth]); // currentMonthが変化したときに再実行

  // 年月を "YYYY年MM月" の形式にフォーマット
  const formattedMonth = `${currentMonth.getFullYear()}年${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}月`;

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  const monthChange = (direction: "previous" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "previous") {
      newMonth.setMonth(currentMonth.getMonth() - 1); // 前月
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1); // 次月
    }
    setCurrentMonth(newMonth);
  };

  const switchToggle = () => {
    const newChecked = !checked; // スイッチの新しい状態
    setChecked(newChecked);
    fetchTransactions(newChecked); // スイッチの状態を渡してデータ取得
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
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

            <PieChart
              series={[
                {
                  data: expenses, // 変換したデータを渡す
                },
              ]}
              width={500}
              height={200}
            />
            <Box display="flex" alignItems="center" gap={1} marginTop={1}>
              {/* 支出ラベル */}
              <Typography
                sx={{
                  color: checked ? "gray" : "red", // オフ時は赤、オン時は灰色
                  fontWeight: !checked ? "bold" : "normal", // オフ時は太字
                }}
              >
                支出
              </Typography>

              {/* スイッチ */}
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

              {/* 収入ラベル */}
              <Typography
                sx={{
                  color: checked ? "blue" : "gray", // オン時は緑、オフ時は灰色
                  fontWeight: checked ? "bold" : "normal", // オン時は太字
                }}
              >
                収入
              </Typography>
            </Box>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
