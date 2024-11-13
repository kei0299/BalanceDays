import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button, Box } from "@mui/material";
import React, { useState } from "react";
import { saveAuthHeaders } from "../utils/authHeaders";
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
import CheckIcon from "@mui/icons-material/Check";

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

  // 新規登録
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 必須フィールドチェック
    if (!email || !password || !passwordConfirmation) {
      alert("すべてのフィールドを入力してください");
      return;
    }

    // パスワード一致チェック
    if (password !== passwordConfirmation) {
      alert("パスワードが一致しません");
      console.log("入力されたパスワード:", password);
      console.log("確認用パスワード:", passwordConfirmation);
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
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors && errorData.errors.email) {
          
          return;
        }
        console.log(errorData);
        throw new Error("登録に失敗しました");
      }
      alert("登録が成功しました");
      
      //　登録後の自動ログイン
      try {
        const loginResponse = await fetch(
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

        if (!loginResponse.ok) {
          throw new Error("ログインに失敗しました");
        }

        const accessToken = response.headers.get("access-token");
        const client = response.headers.get("client");
        const uid = response.headers.get("uid");
      
        if (accessToken && client && uid) {
          localStorage.setItem("access-token", accessToken);
          localStorage.setItem("client", client);
          localStorage.setItem("uid", uid);
        }
  
        alert("ログインしました");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        window.location.href = "/home";
      } catch (error) {
        console.error(error);
        alert("自動ログイン処理でエラーが発生しました");
      }
  
    } catch (error) {
      console.error(error);
      alert("登録処理でエラーが発生しました");
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
            <h1>新規作成</h1>

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

              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1 }}>
                <LockIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <FormControl variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">
                    パスワード
                  </InputLabel>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end"></InputAdornment>
                    }
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-end", mb: 5 }}>
                <CheckIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <FormControl variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">
                    パスワード確認
                  </InputLabel>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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

              <Button type="submit" variant="outlined" onClick={handleSubmit}>
                作成する
              </Button>
            </Box>
          </Box>
        </main>
        <Footer />
      </div>
    </>
  );
}
