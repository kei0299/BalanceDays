import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";

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

MyApp.getInitialProps = async (appContext: any) => {
  const cookies = parseCookies(appContext.ctx);
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
        appContext.ctx.res.statusCode = 302;
        appContext.ctx.res.setHeader("Location", "/signin");
        return {};
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
