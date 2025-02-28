import { Box, Stack } from "@mui/material";
import Header from "@/components/headerLogin";
import FooterLogin from "@/components/footerLogin";
import { useState, useEffect } from "react";
// import { checkSession } from "@/utils/auth/checkSession"; // セッション情報確認用
import Image from "next/image";
import { fetchCharacter } from "@/utils/auth/fetchCharacter";
import * as React from "react";
import CustomLineChart from "@/components/CustomLineChart";
import { Typography } from "@mui/material";
import HomePieChart from "@/components/homePieChart";
import HomeTotalGauge from "@/components/homeTotalGauge";
import { fetchHomeData } from "@/utils/api/totalMoney";
import Link from "@mui/material/Link";

export default function Home() {
  const currentMonth: Date = new Date();
  const [today, setToday] = useState("");
  const [totalIncome, setTotalIncome] = useState<number | null>(null);
  const [totalExpense, setTotalExpense] = useState<number | null>(null);
  // キャラ切り替えのための状態を管理
  const [characterStatus, setCharacterStatus] = useState<number | null>(null);
  const [life, setLife] = useState<number | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    // セッション情報確認用
    // const fetchSessionData = async () => {
    //   try {
    //     const sessionData = await checkSession(); // checkSessionの結果を取得
    //     console.log(sessionData); // データをログに出力
    //   } catch (error) {
    //     console.error("セッションチェックエラー", error);
    //   }
    // };

    const date = new Date();

    // 年・月・日を取得（ゼロ埋め）
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 月は0始まりなので+1
    const dd = String(date.getDate()).padStart(2, "0");

    // 曜日を取得（短縮形）
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getDay()];

    // フォーマット整形
    setToday(`${yyyy}/${mm}/${dd}(${day})`);

    const fetchCharacterData = async () => {
      try {
        const response = await fetchCharacter(apiFormattedDate);
        const {
          character_status: characterNum,
          set_life,
          chart_data,
        } = response; // JSONからデータを分割代入
        setChartData(chart_data);
        setCharacterStatus(characterNum);
        setLife(set_life);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };
    const getData = async () => {
      const data = await fetchHomeData();
      if (data) {
        setTotalIncome(data.total_income);
        setTotalExpense(data.total_expense);
      }
    };
    getData();
    fetchCharacterData();
    // fetchSessionData(); // HOMEでのセッション確認用
  }, []);

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`;

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <Box sx={{ mt: 10, mb: 10 }}>
            {" "}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Poppins', Black 900 Italic",
                fontWeight: "bold",
                color: "#5393ff",
                letterSpacing: "2px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                padding: "10px",
              }}
            >
              {today}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', Black 900 Italic",
                fontWeight: "bold",
                color: "#5393ff",
                letterSpacing: "2px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                padding: "10px",
              }}
            >
              今月の収入：¥{(totalIncome ?? 0).toLocaleString()}
              <br />
              今月の支出：¥{(totalExpense ?? 0).toLocaleString()}
            </Typography>
            <Link
              href="calendar"
              sx={{
                color: "gray",
                textDecoration: "none",
                fontSize: "14px",
                ml: 1,
                display: "inline-block",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              詳しく見る →
            </Link>
          </Box>

          <Box
            sx={{
              height: "50vh",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              {characterStatus === 3 ? (
                <>
<Stack spacing={2} direction="row" alignItems="center">
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Box sx={{ display: "flex", pt: 30,pr: 20 }}>
                        <HomePieChart />
                        <CustomLineChart xData={xData} chartData={chartData} />
                      </Box>
                    </Stack>

                    <Stack spacing={2} direction="column" alignItems="center">
                    <Box sx={{ pt: 12, position: "relative", left: "-60px"  }}>
                      <HomeTotalGauge />
                      <Image
                        src="/image/warning.png"
                        alt="Character 1"
                        width={250}
                        height={250}
                      />
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "2.5rem",
                      fontFamily: "'Poppins', Black 900 Italic",
                      fontWeight: "bold",
                      color: "#ff4500",
                      letterSpacing: "2px",
                      marginBottom: "30px",
                    }}
                  >
                    あと{life}ヶ月生活できそうです
                  </Typography>
                </>
              ) : characterStatus === 2 ? (
                <>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Box sx={{ display: "flex", pt: 30,pr: 20 }}>
                        <HomePieChart />
                        <CustomLineChart xData={xData} chartData={chartData} />
                      </Box>
                    </Stack>

                    <Stack spacing={2} direction="column" alignItems="center">
                    <Box sx={{ pt: 12, position: "relative", left: "-60px"  }}>
                      <HomeTotalGauge />
                      <Image
                        src="/image/caution.png"
                        alt="Character 2"
                        width={250}
                        height={250}
                      />
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "2.5rem",
                      fontFamily: "'Poppins', Black 900 Italic",
                      fontWeight: "bold",
                      color: "#ffd700",
                      letterSpacing: "2px",
                      marginBottom: "30px",
                    }}
                  >
                    あと{life}ヶ月生活できそうです
                  </Typography>
                </>
              ) : characterStatus === 1 ? (
                <>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Box sx={{ display: "flex", pt: 30,pr: 20 }}>
                        <HomePieChart />
                        <CustomLineChart xData={xData} chartData={chartData} />
                      </Box>
                    </Stack>

                    <Stack spacing={2} direction="column" alignItems="center">
                    <Box sx={{ pt: 12, position: "relative", left: "-60px"  }}>
                      <HomeTotalGauge />
                      <Image
                        src="/image/stable.png"
                        alt="Character 3"
                        width={250}
                        height={250}
                      />
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "2.5rem",
                      fontFamily: "'Poppins', Black 900 Italic",
                      fontWeight: "bold",
                      color: "#4169e1",
                      letterSpacing: "2px",
                      marginBottom: "30px",
                    }}
                  >
                    あと{life}ヶ月生活できそうです
                  </Typography>
                </>
              ) : (
                <p>
                  設定→生存期間設定から情報を登録してください。
                  <br />
                  さらに予算を設定することで今月の予算から過去12ヶ月分を取得し、生存期間を算出します。
                </p>
              )}
            </div>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
