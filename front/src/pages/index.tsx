import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import * as gtag from "@/lib/gtag";

export default function Index() {
  const signInWithGoogle = async (): Promise<void> => {
    try {
      //Google認証開始のエンドポイント
      const backendAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google_oauth2`;
      //認証終了後の遷移先
      const originUrl =
        process.env.NODE_ENV === "development"
          ? `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/google_callback`
          : `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/google_callback`;
      // console.log(`Frontのパス${process.env.NEXT_PUBLIC_FRONT_URL}`);
      // console.log(`APIのパス${process.env.NEXT_PUBLIC_API_URL}`);
      // console.log(`バックエンドオースのパス${backendAuthUrl}`);
      if (!originUrl) {
        console.error("OriginUrlが見つかりません");
        return;
      }
      const redirectUrl = `${backendAuthUrl}?auth_origin_url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_FRONT_URL}/callback`
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
              sx={{
                mt: "10px",
                maxWidth: "240px",
                height: "40px",
                backgroundColor: "#4285F4",
                color: "white",
                textTransform: "none",
                boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.25)",
                paddingLeft: "5px",
                paddingRight: "12px",
                "&:hover": {
                  backgroundColor: "#357ae8",
                },
              }}
              onClick={signInWithGoogle}
            >
              <img
                src="/image/google_logo.png"
                alt="Google Logo"
                style={{
                  width: "30px", // ロゴのサイズを調整
                  height: "30px", // 高さを小さくして余白を減らす
                  borderRadius: "4px",
                  marginRight: "6px",
                }}
              />
              <span>Googleでログイン</span>
            </Button>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
