import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack,Box } from "@mui/material";

export default function Index() {
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
