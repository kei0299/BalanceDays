import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import * as gtag from "@/lib/gtag";

export default function Index() {
  console.log(gtag.GA_MEASUREMENT_ID);

  return (
    <>
      <Header />
      <Head>
        <title>BalanceDays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
 
           gtag('config', '${gtag.GA_MEASUREMENT_ID}');
           `,
          }}
        />

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
