import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";

export default function Index() {
  return (
    <>
      <Header />
      <Head>
        <title>BalanceDays</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Google Analytics Script */}
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}'
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </script>
      </Head>
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
            <h1>サービス説明</h1>
            <Stack spacing={2} direction="row">
              <Button href="/signup" variant="outlined">
                新規作成
              </Button>
              <Button href="/signin" variant="outlined">
                ログイン
              </Button>
            </Stack>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
