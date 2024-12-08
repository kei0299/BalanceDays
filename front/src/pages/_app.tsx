import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { checkSession } from "@/utils/auth/checkSession";
import { AppContext } from "next/app";
import Script from "next/script";
import * as gtag from "@/lib/gtag";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Google Analytics のページビュー計測
    const handleRouterChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouterChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouterChange);
    };
  }, [router.events]);

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
  }, [router]);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_MEASUREMENT_ID}');
          `,
        }}
      />
      {/* Main Component */}
      <Component {...pageProps} />
    </>
  );
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
      return { pageProps: {} };
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
