import { useEffect } from "react";
import { checkSession } from "@/utils/auth/checkSession";

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionData = await checkSession(); // checkSessionの結果を取得
        console.log(sessionData);
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };
    fetchSessionData();
  }, []);