import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Box } from "@mui/material";
import React, { useState } from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { setCookie } from "nookies";
import { useAlert } from "@/components/AlertContext";

export default function InputAdornments() {
  const { showAlert } = useAlert();
  // 目のアイコンクリックイベント（パスワードの表示、非表示）
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // ログイン機能
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ログインボタン
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // 必須フィールドチェック
    if (!email || !password) {
      showAlert("すべてのフィールドを入力してください。", "warning");
      return;
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      showAlert("パスワードは6文字以上で入力してください。", "warning");
      return;
    }

    // railsAPI_ログイン
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        showAlert("ログインに失敗しました。", "error");
        throw new Error("ログインに失敗しました");
      }
      const accessToken = response.headers.get("access-token");
      const client = response.headers.get("client");
      const uid = response.headers.get("uid");

      const setAccessToken = (
        accessToken: string,
        client: string,
        uid: string
      ) => {
        setCookie(null, "accessToken", accessToken, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        }); // 30日間の有効期限
        setCookie(null, "client", client, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "uid", uid, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      };

      if (accessToken && client && uid) {
        setAccessToken(accessToken, client, uid);

        showAlert("ログインに成功しました。", "error");
        setEmail("");
        setPassword("");
      }

      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />

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
            <h1>ログイン</h1>

            <Box sx={{ width: "30ch" }}>
              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
                <MailOutlineOutlinedIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  id="input-with-sx"
                  label="メールアドレス"
                  variant="standard"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: "100%" }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 5 }}>
                <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <FormControl variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">
                    パスワード
                  </InputLabel>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: "110%" }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Button type="submit" variant="outlined" onClick={handleLogin}>
                ログインする
              </Button>
            </Box>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
