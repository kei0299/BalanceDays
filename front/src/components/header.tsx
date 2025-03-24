import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Box, Stack } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import { useAlert } from "@/components/AlertContext";

export default function MenuAppBar() {
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ color: "#ffffff", backgroundColor: "#9bc0ff" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* BalanceDays のロゴ */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: "24px",
              "@media (max-width: 599px)": {
                fontSize: "15px",
              },
            }}
          >
            <Link href="/" passHref>
              <Box sx={{ textDecoration: "none", color: "inherit" }}>
                BalanceDays
              </Box>
            </Link>
          </Typography>

          {/* ボタンエリア（右寄せ） */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Link href="/signup" passHref>
                <Button
                  variant="contained"
                  sx={{
                    height: "40px",
                    backgroundColor: "#4169e1",
                    "@media (max-width: 599px)": {
                      height: "30px",
                      fontSize: "10px",
                      padding: "4px 8px",
                    },
                  }}
                >
                  新規作成
                </Button>
              </Link>

              <Link href="/signin" passHref>
                <Button
                  variant="contained"
                  sx={{
                    height: "40px",
                    backgroundColor: "#4169e1",
                    "@media (max-width: 599px)": {
                      height: "30px",
                      fontSize: "10px",
                      padding: "4px 8px",
                    },
                  }}
                >
                  ログイン
                </Button>
              </Link>

              <Button
                sx={{
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
                  "@media (max-width: 599px)": {
                    height: "30px",
                    fontSize: "10px",
                    padding: "4px 8px",
                  },
                }}
                onClick={signInWithGoogle}
              >
                <Box
                  component="img"
                  src="/image/google_logo.png"
                  alt="Google Logo"
                  sx={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "4px",
                    marginRight: "6px",
                    "@media (max-width: 599px)": {
                      width: "24px",
                      height: "24px",
                      marginRight: "4px",
                    },
                  }}
                />
                <span>Googleでログイン</span>
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
