import { parseCookies } from "nookies";

// 会社名を取得
export const fetchCompanyName = async () => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // APIリクエスト
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/jobs/company_index`,
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
      throw new Error("セッション情報がありません");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
  }
};
