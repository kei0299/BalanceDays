import Header from "@/components/headerLogin";
import FooterLogin from "@/components/footerLogin";
import {
  Box,
  Button,
  Stack,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { checkSession } from "@/utils/auth/checkSession";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import React, { useState, useEffect } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/AlertContext";

export default function Setting() {
  const { showAlert } = useAlert();
  // const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionData = await checkSession();
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
        showAlert("メールアドレスの更新に失敗しました。", "error");
        throw new Error("メールアドレスの更新に失敗しました");
      }

      // サーバーからの新しいuidを取得
      const updatedUid = email;

      // クッキーに新しい uid を保存
      setCookie(null, "uid", updatedUid, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      showAlert("メールアドレスを更新しました。", "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // 退会ボタン
  // const userDelete = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const cookies = parseCookies();
  //   const accessToken = cookies["accessToken"];
  //   const client = cookies["client"];
  //   const uid = cookies["uid"];

  //   try {
  //     // 退会処理
  //     const deleteResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/delete_user`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "access-token": accessToken,
  //           client: client,
  //           uid: uid,
  //         },
  //       }
  //     );

  //     if (!deleteResponse.ok) {
  //       showAlert("退会処理に失敗しました。", "error");
  //       throw new Error("退会処理に失敗しました");
  //     }

  //     // クッキー削除
  //     destroyCookie(null, "accessToken");
  //     destroyCookie(null, "client");
  //     destroyCookie(null, "uid");

  //     showAlert("退会処理が完了しました。", "success");
  //     router.push("/");
  //   } catch (error) {
  //     console.error(error);
  //     showAlert("エラーが発生しました。再試行してください。", "error");
  //   }
  // };

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
                alignItems: "center",
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
            {/* <Button
              sx={{ mt: 5 }}
              type="submit"
              color="error"
              variant="contained"
              onClick={() => setOpen(true)}
            >
              退会する
            </Button> */}

            {/* 退会確認ダイアログ */}
            {/* <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>本当に退会しますか？</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  退会すると、アカウントの情報は削除され、元に戻せません。
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                  キャンセル
                </Button>
                <Button onClick={userDelete} color="error">
                  退会する
                </Button>
              </DialogActions>
            </Dialog> */}
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
