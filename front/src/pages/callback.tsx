import { useEffect, useState } from "react";
import { setCookie } from "nookies";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
          method: "GET",
          credentials: "include", // 必要に応じてクッキーを送る
        });

        if (!response.ok) {
          throw new Error("Googleログインに失敗しました");
        }

        // レスポンスヘッダーからトークンを取得
        const accessToken = response.headers.get("access-token");
        const client = response.headers.get("client");
        const uid = response.headers.get("uid");

        if (accessToken && client && uid) {
          // クッキーに保存（認証情報を保持するため）
          setCookie(null, "accessToken", accessToken, { maxAge: 30 * 24 * 60 * 60, path: "/" });
          setCookie(null, "client", client, { maxAge: 30 * 24 * 60 * 60, path: "/" });
          setCookie(null, "uid", uid, { maxAge: 30 * 24 * 60 * 60, path: "/" });

          console.log("Googleログイン成功:", { accessToken, client, uid });
        } else {
          throw new Error("認証情報が取得できませんでした");
        }
      } catch (error) {
        console.error("セッションチェックエラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  return <div>{loading ? "ログイン処理中..." : "ログイン完了"}</div>;
}
