import { Box, Stack } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { useState, useEffect } from "react";
// import { checkSession } from "@/utils/auth/checkSession"; // セッション情報確認用
import Image from "next/image";
import { fetchCharacter } from "@/utils/auth/fetchCharacter";
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Home() {
  const currentMonth: Date = new Date();
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

    const fetchCharacterData = async () => {
      try {
        const response = await fetchCharacter(apiFormattedDate); // `fetchCharacter`はAPIコール関数と仮定
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
      <div
        style={{ height: "100vh", overflow: "hidden", position: "relative" }}
      >
        <main>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100vh",
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
                  <h1 style={{ color: "#ff4500", marginBottom: "20px" }}>
                    あと{life}ヶ月生活できそうです
                  </h1>
                  <Stack spacing={2} direction="row">
                  <LineChart
                      xAxis={[
                        {
                          data: xData,
                          label: "月",
                          min: 1,
                          tickInterval: xData,
                        },
                      ]}
                      yAxis={[
                        {
                          label: "円",
                          labelFontSize: 14,
                          labelStyle: {
                            transform: "translateX(-50px)",
                          },
                          min: 0
                        },
                      ]}
                      series={[
                        {
                          data: chartData,
                          label: "貯金残高推移予測",
                        },
                      ]}
                      width={400}
                      height={300}
                      margin={{
                        left: 100,
                      }}
                    />
                    <Image
                      src="/image/warning.png"
                      alt="Character 1"
                      width={300}
                      height={300}
                    />
                  </Stack>
                </>
              ) : characterStatus === 2 ? (
                <>
                  <h1 style={{ color: "#ffd700", marginBottom: "20px" }}>
                    あと{life}ヶ月生活できそうです
                  </h1>
                  <Stack spacing={2} direction="row">
                  <LineChart
                      xAxis={[
                        {
                          data: xData,
                          label: "月",
                          min: 1,
                          tickInterval: xData,
                        },
                      ]}
                      yAxis={[
                        {
                          label: "円",
                          labelFontSize: 14,
                          labelStyle: {
                            transform: "translateX(-50px)",
                          },
                          min: 0
                        },
                      ]}
                      series={[
                        {
                          data: chartData,
                          label: "貯金残高推移予測",
                        },
                      ]}
                      width={400}
                      height={300}
                      margin={{
                        left: 100,
                      }}
                    />
                    <Image
                      src="/image/caution.png"
                      alt="Character 2"
                      width={300}
                      height={300}
                    />
                  </Stack>
                </>
              ) : characterStatus === 1 ? (
                <>
                  <h1 style={{ color: "#4169e1", marginBottom: "20px" }}>
                    あと{life}ヶ月生活できそうです
                  </h1>
                  <Stack spacing={2} direction="row">
                    <LineChart
                      xAxis={[
                        {
                          data: xData,
                          label: "月",
                          min: 1,
                          tickInterval: xData,
                        },
                      ]}
                      yAxis={[
                        {
                          label: "円",
                          labelFontSize: 14,
                          labelStyle: {
                            transform: "translateX(-50px)",
                          },
                          min: 0
                        },
                      ]}
                      series={[
                        {
                          data: chartData,
                          label: "貯金残高推移予測",
                        },
                      ]}
                      width={400}
                      height={300}
                      margin={{
                        left: 100,
                      }}
                    />
                    <Image
                      src="/image/stable.png"
                      alt="Character 3"
                      width={300}
                      height={300}
                    />
                  </Stack>
                </>
              ) : (
                <p>
                  設定→生存期間設定から情報を登録してください。
                  <br />
                  予算を設定することで今月の予算から過去12ヶ月分を取得し、生存期間を算出します。
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
