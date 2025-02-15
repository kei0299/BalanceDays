import { parseCookies } from "nookies";

// キャラクター情報の取得
export const fetchCharacter = async (currentMonth: string) => {
  try {
    // クッキーからトークンを取得
    const cookies = parseCookies();
    const accessToken = cookies["accessToken"];
    const client = cookies["client"];
    const uid = cookies["uid"];

    // APIリクエスト
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/characters`,
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

    const data = await response.json();
    return data;
 

  } catch (error) {
    console.error(error);
  }
};
