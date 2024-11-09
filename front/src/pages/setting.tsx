import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box,Button } from "@mui/material";

export default function Setting() {

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}
    >
          <h1>設定画面</h1>

          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
