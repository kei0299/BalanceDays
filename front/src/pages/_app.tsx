import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";
import { AppContext } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const AuthCheck = async () => {
      const result = await checkSession();
      if (!result) {
        window.location.href = "/signin";
      }
    };

    router.beforePopState(({ url }) => {
      if (
        url !== "/" &&
        url !== "/_error" &&
        url !== "/signin" &&
        url !== "/signup"
      ) {
        AuthCheck(); // 非同期関数を呼び出し
        return false; // `beforePopState`では`false`を返し、リダイレクト処理を非同期で行う
      }
      return true;
    });
  }, [router]);

  const component =
    typeof pageProps === "undefined" ? null : <Component {...pageProps} />;

  return component;
};

// 型を適切に設定
MyApp.getInitialProps = async (appContext: AppContext) => {
  const cookies = parseCookies(appContext.ctx);
  
  // クライアントサイドでもサーバーサイドでも適切に処理を行う
  if (
    appContext.ctx.pathname !== "/" &&
    appContext.ctx.pathname !== "/_error" &&
    appContext.ctx.pathname !== "signup" &&
    appContext.ctx.pathname !== "/signin"
  ) {
    if (typeof cookies.accessToken === "undefined") {
      const isServer = typeof window === "undefined";
      if (isServer) {
        console.log("in ServerSide");

        // サーバーサイドでのみ res を設定
        if (appContext.ctx.res) {
          appContext.ctx.res.statusCode = 302;
          appContext.ctx.res.setHeader("Location", "/signin");
        }

        return {}; // サーバーサイドリダイレクト処理
      } else {
        console.log("in ClientSide");
      }
    }
  }

  return {
    pageProps: {
      ...(appContext.Component.getInitialProps
        ? await appContext.Component.getInitialProps(appContext.ctx)
        : {}),
      pathname: appContext.ctx.pathname,
    },
  };
};

export default MyApp;
