import { setCookie } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return; // クエリパラメータが準備できるまで待つ

    const { accessToken, client_id, uid } = router.query; // URLからパラメータを取得

    if (accessToken && client_id && uid) {
      // クッキーに保存
      setCookie(null, "accessToken", accessToken as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "client", client_id as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });
      setCookie(null, "uid", uid as string, { maxAge: 30 * 24 * 60 * 60, path: "/" });

      console.log(accessToken, client_id, uid);
      // ホームページへリダイレクト
      // router.push("/home");
    } else {
      console.error("必要な認証情報が取得できませんでした");
    }
  }, [router.isReady, router.query]); // クエリパラメータが変わったら実行

  return <div>ログイン処理中...</div>;
}
