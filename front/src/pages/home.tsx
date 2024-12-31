import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { useState, useEffect } from "react";
// import { checkSession } from "@/utils/auth/checkSession";　// セッション情報確認用
import Image from "next/image";
import { fetchCharacter } from "@/utils/auth/fetchCharacter";
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Home() {
  const currentMonth: Date = new Date();
  // キャラ切り替えのための状態を管理
  const [characterStatus, setCharacterStatus] = useState<number | null>(null);
  const [life, setLife] = useState<number | null>(null);

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
        const { character_status: characterNum, set_life } = response; // JSONからデータを分割代入
        setCharacterStatus(characterNum);
        setLife(set_life);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };

    fetchCharacterData();
    // fetchSessionData(); // HOMEでのセッション確認用
  }, []); // 初回レンダリング時のみ実行されるように空の依存配列を指定

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
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
                  <Image
                    src="/image/warning.png"
                    alt="Character 1"
                    width={300}
                    height={300}
                  />
                </>
              ) : characterStatus === 2 ? (
                <>
                  <h1 style={{ color: "#ffd700", marginBottom: "20px" }}>
                    あと{life}ヶ月生活できそうです
                  </h1>
                  <Image
                    src="/image/caution.png"
                    alt="Character 2"
                    width={300}
                    height={300}
                  />
                </>
              ) : characterStatus === 1 ? (
                <>
                  <h1 style={{ color: "#4169e1", marginBottom: "20px" }}>
                    あと{life}ヶ月生活できそうです
                  </h1>
                  <Image
                    src="/image/stable.png"
                    alt="Character 3"
                    width={300}
                    height={300}
                  />
                </>
              ) : (
                <p>
                  設定→生存期間設定から情報を登録してください。
                  <br />
                  予算を設定することで今月の予算から過去12ヶ月分を取得し、生存期間を算出します。
                </p>
              )}
            </div>

            <Box
              sx={{
                position: "absolute",
                bottom: "50px",
                left: "20px",
              }}
            >
              <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }]}
                series={[
                  {
                    data: [10000, 9000, 8000,7000,6000,5000],
                  },
                ]}
                width={400}
                height={300}
              />
            </Box>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
