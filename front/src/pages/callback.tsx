import { setCookie } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { auth_token, client_id, uid } = router.query;

    if (auth_token && client_id && uid) {
      setCookie(null, "accessToken", auth_token as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "client", client_id as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "uid", uid as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });

      router.push("/home");
    } else {

      console.error("必要な認証情報が取得できませんでした");
    }
  }, [router.isReady, router.query]);

  return <div>ログイン処理中...</div>;
}
