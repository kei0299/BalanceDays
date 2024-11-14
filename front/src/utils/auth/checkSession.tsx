import { parseCookies } from "nookies";

// セッション情報を取得する関数
export const checkSession = async () => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["access-token"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // APIリクエスト
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sessions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": accessToken,
          client: client,
          uid: uid,
        },
      }
    );

    // レスポンスが正常でない場合エラーをスロー
    if (!response.ok) {
      throw new Error("セッション情報がありません");
    }

    // レスポンスのJSONデータを取得
    const data = await response.json();
    return data;
    // console.log(data.is_login); // ログイン状態を確認

    // セッションチェックの結果を利用して、必要に応じて状態を更新する処理を追加できます
  } catch (error) {
    console.error(error); // エラー処理
  }
};
