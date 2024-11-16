import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import React from "react";

export default function Home() {

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