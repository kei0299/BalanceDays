import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box, Button, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import React, { useState } from "react";
import { setCookie } from "nookies";

export default function Setting() {
  const [email, setEmail] = useState<string>("");

  // ログインボタン
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    // railsAPI_メールアドレス更新
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("更新に失敗しました");
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
        // クッキーにアクセス・クライアント・ユーザーIDを格納
        setAccessToken(accessToken, client, uid);

        alert("更新しました");
        setEmail("");
      }

      // window.location.href = "/home";
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
            <h1>アカウント編集</h1>

            <Stack
              spacing={2}
              direction="row"
              sx={{
                alignItems: "center", // 水平方向で中央揃え
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <MailOutlineOutlinedIcon
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  id="input-with-sx"
                  label="メールアドレス"
                  variant="standard"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: "250px" }}
                />
              </Box>

              <Button type="submit" variant="outlined">
                更新
              </Button>
            </Stack>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
