import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import React, {useEffect,useState} from "react";
import { checkSession } from "@/utils/auth/checkSession";

export default function Home() {
  const [sessionData, setSessionData] = useState<any>(null); // セッションデータを状態として管理

  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchSessionData = async () => {
      try {
        const data = await checkSession(); // checkSessionの結果を取得
        console.log(data); // データをログに出力
        setSessionData(data); // セッション情報を状態に保存
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchSessionData(); // 初回レンダリング時にセッション情報を取得
  }, []); // 初回レンダリング時のみ実行されるように空の依存配列を指定
  //     // セッションが存在しない、またはログインしていない場合のリダイレクト
  //     if (!session || !session.is_login) {
  //       return {
  //         redirect: {
  //           destination: "/signin",
  //           permanent: false,
  //         },
  //       };
  //     }
  
  //     // セッションがある場合、ページコンポーネントにデータを渡す
  //     return {
  //       props: { sessionData: session },
  //     };
  //   } catch (error) {
  //     console.error("セッションチェックエラー:", error);
  //     return {
  //       redirect: {
  //         destination: "/signin",
  //         permanent: false,
  //       },
  //     };
  //   }
  // };
  
  // // ページコンポーネント
  // const HomePage = ({ sessionData }: PageProps) => {

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
            <h1>Home画面</h1>

          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}

// export default HomePage;