import { setCookie } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
  
    const accessToken = String(router.query.accessToken ?? "");
    const client = String(router.query.client ?? "");
    const uid = String(router.query.uid ?? "");
  
    if (accessToken && client && uid) {
      setCookie(null, "accessToken", accessToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "client", client, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "uid", uid, { maxAge: 30 * 24 * 60 * 60, path: "/" });
  
      console.log(accessToken, client, uid);
      router.push("/home");
    } else {
      console.error("必要な認証情報が取得できませんでした");
    }
  }, [router.isReady, router.query]);
  

  return <div>ログイン処理中...</div>;
}
