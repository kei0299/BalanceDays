import { useEffect, useState } from "react";
import { checkSession } from "@/utils/auth/checkSession";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionData = await checkSession();
        console.log(sessionData);
      } catch (error) {
        console.error("セッションチェックエラー", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionData();
  }, []);

  return <div>{loading ? "ログイン処理中..." : "完了"}</div>;
}
