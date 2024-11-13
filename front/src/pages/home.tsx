import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { sessionCheck } from "@/utils/sessionCheck";

export default function Home() {
  // Homeコンポーネントのマウント時にセッションを確認
  useEffect(() => {
    sessionCheck();
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
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            <h1>Home画面</h1>
            
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
