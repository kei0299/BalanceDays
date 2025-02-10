import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";
import { AppContext } from "next/app";
import Meta from "../components/Meta";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const AuthCheck = async () => {
      const publicPages = ["/", "/_error", "/signin", "/signup"];
      if (!publicPages.includes(router.pathname)) {
        const result = await checkSession();
        if (!result) {
          router.push("/signin");
        }
      }
    };

    AuthCheck(); // 初期ロード時のチェック

    router.beforePopState(({ url }) => {
      const publicPages = ["/", "/_error", "/signin", "/signup"];
      if (!publicPages.includes(url)) {
        AuthCheck();
        return false;
      }
      return true;
    });
  }, [router]);
  
  <Meta />;
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const publicPages = ["/", "/_error", "/signin", "/signup"];
  const cookies = parseCookies(appContext.ctx);

  if (!publicPages.includes(appContext.ctx.pathname)) {
    if (!cookies.accessToken) {
      if (appContext.ctx.res) {
        appContext.ctx.res.statusCode = 302;
        appContext.ctx.res.setHeader("Location", "/signin");
      }
      return {};
    }
  }

  return {
    pageProps: {
      ...(appContext.Component.getInitialProps
        ? await appContext.Component.getInitialProps(appContext.ctx)
        : {}),
    },
  };
};

export default MyApp;
