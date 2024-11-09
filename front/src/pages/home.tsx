import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { Box,Button } from "@mui/material";

export default function Home() {

      // セッションボタン
      const handleSession = async (event: React.FormEvent) => {
        event.preventDefault();
    
        // localStorageからトークンを取得
        const accessToken = localStorage.getItem("access-token");
        const client = localStorage.getItem("client");
        const uid = localStorage.getItem("uid");
  
        if (!accessToken || !client || !uid) {
          alert("セッション情報がありません。");
          return;
        }
  
        // railsAPIセッション
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sessions`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "access-token": accessToken,
                client: client,
                uid: uid,
            }
        });
    
          if (!response.ok) {
            throw new Error("セッションに失敗しました");
          }
    
          const data = await response.json();
  
          console.log(data);
          // console.log(data.data.email);
  
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}
    >
          <h1>Home画面</h1>
          <Button type="submit" variant="outlined" onClick={handleSession}>
                セッション
              </Button>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
