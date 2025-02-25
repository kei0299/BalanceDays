import { parseCookies } from "nookies";

export const fetchHomeData = async () => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/transactions/total_money`,
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

    if (!response.ok) {
      throw new Error("データ取得に失敗しました");
    }

    // JSONレスポンスを適切に処理
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("エラー:", error);
    return null;
  }
};
