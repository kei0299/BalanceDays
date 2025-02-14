import { parseCookies } from "nookies";

// セッション情報を取得する関数
export const fetchBudget = async (currentMonth: string) => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // APIリクエスト
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/budgets`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": accessToken,
          client: client,
          uid: uid,
          currentMonth: currentMonth
        },
      }
    );

    // レスポンスが正常でない場合エラーをスロー
    if (!response.ok) {
      throw new Error("セッション情報がありません");
    }

    // レスポンスのJSONデータを取得
    const { budgets } = await response.json();
    return budgets;
 
  } catch (error) {
    console.error(error); // エラー処理
  }
};
