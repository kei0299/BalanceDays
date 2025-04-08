import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";
import { AppContext } from "next/app";
import Meta from "../components/Meta";
import { AlertProvider } from "@/components/AlertContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const AuthCheck = async () => {
      // 下記ページの場合は認証を行わない。
      const publicPages = [
        "/",
        "/_error",
        "/signin",
        "/signup",
        "/callback",
        "/terms/privacyPolicy",
        "/terms/terms",
      ];
      const result = await checkSession();

      if (router.pathname === "/" && result) {
        router.push("/home"); // ログイン済みなら /home へリダイレクト
        return;
      }

      if (!publicPages.includes(router.pathname) && !result) {
        router.push("/signin"); // 未ログインなら /signin へリダイレクト
      }
    };

    AuthCheck(); // 初期ロード時のチェック

    const handlePopState = ({ url }: { url: string }) => {
      const publicPages = ["/", "/_error", "/signin", "/signup", "/callback"];
      if (!publicPages.includes(url)) {
        AuthCheck();
        return false;
      }
      return true;
    };

    // ブラウザバックした時にも認証チェックを行う
    router.beforePopState(handlePopState);

    return () => {
      router.beforePopState(() => true); // beforePopStateを解除
    };
  }, [router]);

  return (
    <>
      <Meta />
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  // 未ログイン時にアクセスできるpath
  const publicPages = ["/", "/_error", "/signin", "/signup", "/callback"];
  const cookies = parseCookies(appContext.ctx); // クッキーから accessToken を取得

  // 現在のページが publicPages に含まれているかをチェック。
  if (!publicPages.includes(appContext.ctx.pathname ?? "")) {
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
