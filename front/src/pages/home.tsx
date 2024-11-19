import { Box,Button } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import React from "react";
import { checkSession } from "@/utils/auth/checkSession";

export default function Home() {
  const handleSession = async (event: React.FormEvent) => {
    event.preventDefault();

    // 非同期関数を定義してセッション情報を取得
      try {
        const data = await checkSession(); // checkSessionの結果を取得
        console.log(data); // データをログに出力
      } catch (error) {
        console.error("セッションチェックエラー", error);
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <h1>Home画面</h1>
            <Button type="submit" variant="outlined" onClick={handleSession}>
                セッション
              </Button>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
