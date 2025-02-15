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

    if (!response.ok) {
      throw new Error("セッション情報がありません");
    }

    const { budgets } = await response.json();
    return budgets;
 
  } catch (error) {
    console.error(error);
  }
};
