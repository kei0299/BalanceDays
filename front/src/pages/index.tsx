import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import * as gtag from "@/lib/gtag";
import GoogleIcon from "@mui/icons-material/Google";

export default function Index() {
  const signInWithGoogle = async (): Promise<void> => {
    try {
      // バックエンドのエンドポイントにリクエストを送る
      //Google認証開始のエンドポイント
      const backendAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google_oauth2`;
      //認証終了後の遷移先
      const originUrl =
        process.env.NODE_ENV === "development"
          ? `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/google_callback`
          : `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/google_callback`;
      console.log(`Frontのパス${process.env.NEXT_PUBLIC_FRONT_URL}`);
      console.log(`APIのパス${process.env.NEXT_PUBLIC_API_URL}`);
      console.log(`バックエンドオースのパス${backendAuthUrl}`);
      if (!originUrl) {
        console.error("OriginUrlが見つかりません");
        return;
      }
      const redirectUrl = `${backendAuthUrl}?auth_origin_url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/google_callback`
      )}`;
      console.log(`リダイレクト${redirectUrl}`);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Google認証中にエラーが発生しました:", error);
      alert("Google認証に失敗しました。再度お試しください。");
    }
  };

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

            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={signInWithGoogle}
            >
              SIGN UP WITH GOOGLE
            </Button>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
