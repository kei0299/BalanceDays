// utils/authCheck.ts
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

interface SessionData {
  is_login: boolean;
  data: {
    email: string;
    // 必要なデータをここに追加
  };
}

export async function getServerSidePropsWithAuth(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> {
  const { req } = context;
  const accessToken = req.cookies["access-token"];
  const client = req.cookies["client"];
  const uid = req.cookies["uid"];

  // トークンがない場合はログインページにリダイレクト
  if (!accessToken || !client || !uid) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    // Rails APIでセッション確認
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-token": accessToken,
        client: client,
        uid: uid,
      },
    });

    // レスポンスが正常でない場合
    if (!response.ok) {
      throw new Error("セッション確認に失敗しました");
    }

    const data: SessionData = await response.json();

    // ログインしていない場合はログインページにリダイレクト
    if (!data.is_login) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }

    // ログインしていればそのまま表示
    return { props: {} };

  } catch (error) {
    console.error("エラー:", error);
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}
