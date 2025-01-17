import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box, Button, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import { checkSession } from "@/utils/auth/checkSession";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import React, { useState, useEffect } from "react";
import { setCookie, parseCookies } from "nookies";

export default function Setting() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionData = await checkSession(); // checkSessionの結果を取得
        setEmail(sessionData.data.email);
        console.log(sessionData);
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };
    fetchSessionData();
  }, []);

  // メールアドレス更新ボタン
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "access-token": accessToken,
            client: client,
            uid: uid,
          },
          body: JSON.stringify({
            user: {
              email: email,
              uid: email,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("設定に失敗しました");
      }

      // サーバーからの新しい uid を取得（メールアドレスが uid になる場合）
      const updatedUid = email;

      // クッキーに新しい uid を保存
      setCookie(null, "uid", updatedUid, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      alert("設定しました");
      window.location.reload();
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
            <h1>アカウント設定</h1>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ width: "250px" }}
                />
              </Box>

              <Button type="submit" variant="outlined" onClick={handleUpdate}>
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
