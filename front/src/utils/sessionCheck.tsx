  // セッション確認処理
  export const sessionCheck = async () => {
    // localStorageからトークンを取得
    const accessToken = localStorage.getItem("access-token");
    const client = localStorage.getItem("client");
    const uid = localStorage.getItem("uid");

    if (!accessToken || !client || !uid) {
      window.location.href = "/signin";
      // alert("ログインしてください。");
      return;
    }

    // railsAPIセッション
    try {
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

      if (!response.ok) {
        throw new Error("セッション情報がありません");
      }

      const data = await response.json();
      console.log(data);
      // セッションチェックの結果を利用して必要に応じて状態を更新するなどの処理を行えます
    } catch (error) {
      console.error(error);
    }
  };
