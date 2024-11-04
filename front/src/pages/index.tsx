import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack,Box } from "@mui/material";

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // 垂直方向の中央揃え
        alignItems: 'center', // 水平方向の中央揃え
        minHeight: '100vh', // 画面全体の高さ
        textAlign: 'center' // テキストを中央揃え
      }}
    >
          <h1>サービス説明</h1>
          <Stack spacing={2} direction="row">
            <Button href="/signup" variant="outlined">新規作成</Button>
            <Button href="/signin" variant="outlined">ログイン</Button>
          </Stack>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
