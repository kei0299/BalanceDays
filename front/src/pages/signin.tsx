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

export default function InputAdornments() {
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
      alert("すべてのフィールドを入力してください");
      return;
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return;
    }

    // railsAPI
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sign_in`,
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
        throw new Error("ログインに失敗しました");
      }
      // トークンを取得して localStorage に保存
      const accessToken = response.headers.get("access-token");
      const client = response.headers.get("client");
      const uid = response.headers.get("uid");

      if (accessToken && client && uid) {
        localStorage.setItem("access-token", accessToken);
        localStorage.setItem("client", client);
        localStorage.setItem("uid", uid);
      }

      alert("ログインに成功しました");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  // ログアウトボタン
  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();


  // localStorage からトークンを取得
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

    // railsAPI
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sign_out`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "access-token": accessToken,
            "client": client,
            "uid": uid  
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ログアウトに失敗しました");
      }
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("uid");

      alert("ログアウトしました");
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
              justifyContent: "center", // 垂直方向の中央揃え
              alignItems: "center", // 水平方向の中央揃え
              minHeight: "100vh", // 画面全体の高さ
              textAlign: "center", // テキストを中央揃え
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Button type="submit" variant="outlined" onClick={handleLogin}>
                ログインする
              </Button>

              <Button type="submit" variant="outlined" onClick={handleLogout}>
                ログアウト
              </Button>
            </Box>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
