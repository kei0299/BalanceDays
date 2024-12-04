import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import React, { useEffect } from "react";
import { checkSession } from "@/utils/auth/checkSession";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchSessionData = async () => {
      try {
        const data = await checkSession(); // checkSessionの結果を取得
        console.log(data); // データをログに出力
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchSessionData(); // 初回レンダリング時にセッション情報を取得
  }, []); // 初回レンダリング時のみ実行されるように空の依存配列を指定
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
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <div className={`fixed top-0 left-0 w-full h-screen z-[100]`}>
              <Image
                src="/image/home.jpg"
                alt="Sample Image"
                width={1600}
                height={800}
                style={{ marginTop: "-70px"}}
              />
            </div>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
