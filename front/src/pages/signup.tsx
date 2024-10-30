import Header from "@/components/headerTop";
import Footer from "@/components/footerTop";
import { Button, Stack,Box } from "@mui/material";

export default function Signup() {
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
        justifyContent: 'center', // 垂直方向の中央揃え
        alignItems: 'center', // 水平方向の中央揃え
        minHeight: '100vh', // 画面全体の高さ
        textAlign: 'center' // テキストを中央揃え
      }}
    >
          <h1>新規作成</h1>
          <Stack spacing={2} direction="row">
            <Button variant="outlined">新規作成</Button>
          </Stack>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
