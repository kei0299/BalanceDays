import { setCookie } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/router";

const setAccessToken = (accessToken: string, client: string, uid: string) => {
  setCookie(null, "accessToken", accessToken, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "client", client, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "uid", uid, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { auth_token, client_id, uid } = router.query; // URLからパラメータを取得

      console.log(auth_token);
      
      if (!auth_token || !client_id || !uid) {
        console.error("認証情報が不足しています");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google_oauth2/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth_token,
              client_id,
              uid,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Google OAuth ログインに失敗しました");
        }

        const accessToken = response.headers.get("access-token");
        const client = response.headers.get("client");
        const uidFromResponse = response.headers.get("uid");
        console.log(accessToken);
        if (accessToken && client && uidFromResponse) {
          setAccessToken(accessToken, client, uidFromResponse);
          router.push("/home");
        } else {
          console.error("必要な認証情報が取得できませんでした");
        }
      } catch (error) {
        console.error("OAuth 処理中にエラー:", error);
      }
    };

    handleOAuthCallback();
  }, [router]);

  return <div>ログイン処理中...</div>;
}
