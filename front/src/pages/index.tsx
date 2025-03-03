import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import * as gtag from "@/lib/gtag";
import { useAlert } from "@/components/AlertContext";
import Image from "next/image";

export default function Index() {
  const { showAlert } = useAlert();
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
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Google認証中にエラーが発生しました:", error);
      showAlert("Google認証に失敗しました。再度お試しください。", "warning");
    }
  };

  return (
    <>
      <Head>
        <title>BalanceDays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
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
              alignItems: "center",
              minHeight: "100vh",
              textAlign: "center",
              mt: 10,
              mb: 10,
            }}
          >
            <h1>あと何ヶ月生活できるかを可視化！</h1>
            <p>「失業後、現在の貯金でどのくらい生活できるのだろう？」</p>
            <p>そんなことを考えたことはありませんか？</p>
            <p>
              BalanceDaysではあとどのくらい生活できるのかを計算し可視化します！
            </p>
            <Stack spacing={2} direction="row" sx={{ mt: 10 }}>
              <Box>
                <h2>STEP1</h2>
                <p>
                  まずは生存期間設定から現在の貯金額を入力し、予算設定画面から予算を設定しよう！
                </p>
                <p>貯金額と予算の設定金額をもとに生存期間が計算されるよ！</p>
              </Box>
              <Image
                src="/image/stable.png"
                alt="Character 3"
                width={100}
                height={100}
              />
            </Stack>

            <Stack spacing={3} direction="row">
              <Image
                src="/image/index/life.png"
                alt="life"
                width={230}
                height={350}
              />
              <Image
                src="/image/index/budget.png"
                alt="life"
                width={550}
                height={350}
              />
              <Image
                src="/image/index/home.png"
                alt="life"
                width={550}
                height={350}
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ mt: 10 }}>
              <Box>
                <h2>STEP2</h2>
                <p>BalanceDaysでは勤務先やシフトの登録もできるよ。</p>
                <p>研修期間や研修時間の設定も楽々〜</p>
                <p>
                  カレンダー画面から選択した日にちの情報が一括表示されるよ！
                </p>
              </Box>
              <Image
                src="/image/caution.png"
                alt="Character 2"
                width={100}
                height={100}
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
              <Image
                src="/image/index/work.png"
                alt="life"
                width={550}
                height={350}
              />

              <Image
                src="/image/index/calendar.png"
                alt="life"
                width={550}
                height={350}
              />
            </Stack>

            <Stack spacing={2} direction="row" sx={{ mt: 10 }}>
              <Box>
                <h2>STEP3</h2>
                <p>登録した収支ログはレポート画面からグラフで確認できるよ！</p>
                <p>
                  カテゴリごとの収支はもちろん、予算と実際の支出を比較できるよ！
                </p>
              </Box>
              <Image
                src="/image/warning.png"
                alt="Character 2"
                width={100}
                height={100}
              />
            </Stack>

            <Stack spacing={3} direction="row">
              <Image
                src="/image/index/income.png"
                alt="life"
                width={300}
                height={300}
              />

              <Image
                src="/image/index/expense.png"
                alt="life"
                width={350}
                height={280}
              />
              <Image
                src="/image/index/gauge.png"
                alt="life"
                width={450}
                height={250}
              />
            </Stack>

            <h1>今すぐ家計簿をつけ始めてみよう！</h1>

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
                m: "10px",
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
