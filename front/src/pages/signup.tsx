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
import CheckIcon from "@mui/icons-material/Check";
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

  // 新規登録
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 必須フィールドチェック
    if (!email || !password || !passwordConfirmation) {
      showAlert("すべてのフィールドを入力してください。", "warning");
      return;
    }

    // パスワード一致チェック
    if (password !== passwordConfirmation) {
      showAlert("パスワードが一致しません。", "warning");
      return;
    }

    // パスワードの長さチェック
    if (password.length < 6) {
      showAlert("パスワードは6文字以上で入力してください。", "warning");
      return;
    }

    // railsAPI_新規登録
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors && errorData.errors.email) {
          return;
        }
        console.log(errorData);
        showAlert("登録に失敗しました。", "error");
        throw new Error("登録に失敗しました");
      }

      //　登録後の自動ログイン
      try {
        const loginResponse = await fetch(
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

        if (!loginResponse.ok) {
          showAlert("ログインに失敗しました。", "error");
          throw new Error("ログインに失敗しました");
        }
        const accessToken = loginResponse.headers.get("access-token");
        const client = loginResponse.headers.get("client");
        const uid = loginResponse.headers.get("uid");

        const setAccessToken = (
          accessToken: string,
          client: string,
          uid: string
        ) => {
          // 30日間の有効期限
          setCookie(null, "accessToken", accessToken, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          setCookie(null, "client", client, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          setCookie(null, "uid", uid, { maxAge: 30 * 24 * 60 * 60, path: "/" });
        };

        if (accessToken && client && uid) {
          setAccessToken(accessToken, client, uid);
        }

        showAlert("新規作成しました。", "success");

        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        window.location.href = "/home";
      } catch (error) {
        console.error(error);
        showAlert("ログインエラーが発生しました。", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("登録エラーが発生しました。", "error");
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
                  sx={{ width: "100%" }}
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
                    sx={{ width: "135%" }}
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
                    sx={{ width: "110%" }}
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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
