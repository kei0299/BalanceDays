import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Stack, Box } from "@mui/material";
import Head from "next/head";
import Script from "next/script";
import * as gtag from "@/lib/gtag";
import { useAlert } from "@/components/AlertContext";
import Typography from "@mui/material/Typography";

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
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "center",
              // minHeight: "100vh",
              // textAlign: "center",
              mt: 10,
              mb: 10,
            }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                あと何ヶ月生活できるかを可視化!
              </Typography>
              <Typography variant="body1">
                「失業後、現在の貯金でどのくらい生活できるのだろう？」
              </Typography>
              <Typography variant="body1">
                そんなことを考えたことはありませんか？
              </Typography>
              <Typography variant="body1">
                BalanceDaysではあとどのくらい生活できるのかを計算し可視化します!
              </Typography>
            </Box>
            <Stack spacing={2} direction="row" sx={{ mt: 5 }}>
              <Box>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    STEP1
                  </Typography>
                  <Box
                    component="img"
                    src="/image/stable.png"
                    alt="Character 3"
                    sx={{
                      width: "50px",
                      height: "50px",
                      transform: "translateX(-15px)",
                    }}
                  />
                </Stack>
                <Typography variant="body1">
                  まずは生存期間設定から現在の貯金額を入力し、予算設定画面から予算を設定しよう！
                </Typography>
                <Typography variant="body1">
                  貯金額と予算の設定金額をもとに生存期間が計算されるよ！
                </Typography>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              sx={{
                flexWrap: "wrap",
                gap: 1,
                "@media (max-width: 599px)": {
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              direction="row"
            >
              <Box
                component="img"
                src="/image/index/life.png"
                alt="life"
                sx={{
                  width: "230px",
                  height: "350px",
                }}
              />
              <Box
                component="img"
                src="/image/index/budget.png"
                alt="budget"
                sx={{
                  width: "540px",
                  height: "350px",
                  "@media (max-width: 599px)": {
                    width: "350px",
                    height: "200px",
                  },
                }}
              />
              <Box
                component="img"
                src="/image/index/home.png"
                alt="home"
                sx={{
                  width: "540px",
                  height: "350px",
                  "@media (max-width: 599px)": {
                    width: "350px",
                    height: "200px",
                  },
                }}
              />
            </Stack>

            <Stack
              spacing={3}
              sx={{
                mt: 5,
                flexWrap: "wrap",
                gap: 1,
                "@media (max-width: 599px)": {
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              direction="row"
            >
              <Box>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    STEP2
                  </Typography>
                  <Box
                    component="img"
                    src="/image/caution.png"
                    alt="Character 2"
                    sx={{
                      width: "50px",
                      height: "50px",
                      transform: "translateX(-15px)",
                    }}
                  />
                </Stack>
                <Typography variant="body1">
                  BalanceDaysでは勤務先やシフトの登録もできるよ。
                </Typography>
                <Typography variant="body1">
                  研修期間や研修時間の設定も楽々〜
                </Typography>
                <Typography variant="body1">
                  カレンダー画面から選択した日にちの情報が一括表示されるよ！
                </Typography>
              </Box>
            </Stack>

            <Stack
              spacing={2}
              sx={{
                flexWrap: "wrap",
                gap: 1,
                "@media (max-width: 599px)": {
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              direction="row"
            >
              <Box
                component="img"
                src="/image/index/work.png"
                alt="work"
                sx={{
                  width: "540px",
                  height: "350px",
                  "@media (max-width: 599px)": {
                    width: "350px",
                    height: "200px",
                  },
                }}
              />
              <Box
                component="img"
                src="/image/index/calendar.png"
                alt="calendar"
                sx={{
                  width: "540px",
                  height: "350px",
                  "@media (max-width: 599px)": {
                    width: "350px",
                    height: "200px",
                  },
                }}
              />
            </Stack>

            <Stack
              spacing={2}
              direction="row"
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                STEP3
              </Typography>
              <Box
                component="img"
                src="/image/warning.png"
                alt="Character 1"
                sx={{
                  width: "50px",
                  height: "50px",
                  transform: "translateX(-15px)",
                }}
              />
            </Stack>
            <Typography variant="body1">
              登録した収支ログはレポート画面からグラフで確認できるよ！
            </Typography>
            <Typography variant="body1">
              カテゴリごとの収支はもちろん、予算と実際の支出を比較できるよ！
            </Typography>

            <Stack
              spacing={2}
              sx={{
                flexWrap: "wrap",
                gap: 1,
                "@media (max-width: 599px)": {
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              direction="row"
            >
              <Box
                component="img"
                src="/image/index/income.png"
                alt="income"
                sx={{
                  width: "350px",
                  height: "300px",
                }}
              />
              <Box
                component="img"
                src="/image/index/expense.png"
                alt="expense"
                sx={{
                  width: "350px",
                  height: "300px",
                }}
              />
                            <Box
                component="img"
                src="/image/index/gauge.png"
                alt="gauge"
                sx={{
                  width: "450px",
                  height: "250px",
                  "@media (max-width: 599px)": {
                    width: "350px",
                    height: "200px",
                  },
                }}
              />
            </Stack>

            <h1>今すぐ家計簿をつけ始めよう！</h1>

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
