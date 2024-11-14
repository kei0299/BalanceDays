import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const data = await checkSession(); // checkSessionの結果を取得
        if (!data.is_login){
          window.location.href = "/signin";
        }
        setSessionData(data); // セッション情報を状態に保存
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    fetchSessionData(); // 初回レンダリング時にセッション情報を取得

    // router.beforePopState(({ url }) => {
    //   // 認証チェックを行わない画面の設定
    //   if (
    //     url !== "/" &&
    //     url !== "/_error" &&
    //     url !== "/signin" &&
    //     url !== "/signup"
    //   ) {
    //     // 非同期処理を含まないコールバックを返す
    //     if (!sessionData) {
    //       window.location.href = "/signin";
    //       return false;
    //     }
    //   }
    //   return true;
    // });
  }, []);

  return <Component {...pageProps} />;
}
