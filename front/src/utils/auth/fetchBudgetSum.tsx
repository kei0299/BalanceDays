import { parseCookies } from "nookies";

// 収支の合計
export const fetchBudgetSum = async (currentMonth: string) => {
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

    const { total_budget } = await response.json();
    return total_budget;
 
  } catch (error) {
    console.error(error);
  }
};
