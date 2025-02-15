import { parseCookies } from "nookies";

// セッション情報を取得する関数
export const getJobInfo = async () => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // APIリクエスト
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs`,
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

  } catch (error) {
    console.error(error); // エラー処理
  }
};
