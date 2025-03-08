import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
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
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref>
              <Box
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                BalanceDays
              </Box>
            </Link>
          </Typography>

          <Box>
            <Link href="/signup" passHref>
              <Button
                variant="contained"
                sx={{
                  height: "40px",
                  marginRight: 1,
                  backgroundColor: "#4169e1",
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
                  marginRight: 1,
                  backgroundColor: "#4169e1",
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
        </Toolbar>
      </AppBar>
    </Box>
  );
}
