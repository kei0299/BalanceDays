import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { useState, useEffect } from "react";
// import { checkSession } from "@/utils/auth/checkSession";　// セッション情報確認用
import Image from "next/image";
import { fetchCharacter } from "@/utils/auth/fetchCharacter";

export default function Home() {
  const currentMonth: Date = new Date();
  // キャラ切り替えのための状態を管理
  const [characterStatus, setCharacterStatus] = useState<number | null>(null);
  const [life, setLife] = useState<number | null>(null);

  useEffect(() => {
    // セッション情報確認用
    // const fetchSessionData = async () => {
    //   try {
    //     const sessionData = await checkSession(); // checkSessionの結果を取得
    //     console.log(sessionData); // データをログに出力
    //   } catch (error) {
    //     console.error("セッションチェックエラー", error);
    //   }
    // };

    const fetchCharacterData = async () => {
      try {
        const response = await fetchCharacter(apiFormattedDate); // `fetchCharacter`はAPIコール関数と仮定
        const { character_status: characterNum, set_life } = response; // JSONからデータを分割代入
        setCharacterStatus(characterNum);
        setLife(set_life);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };

    fetchCharacterData();
    // fetchSessionData(); // HOMEでのセッション確認用
  }, []); // 初回レンダリング時のみ実行されるように空の依存配列を指定

  // API用のフォーマットを "YYYY-MM-DD" 形式で作成
  const apiFormattedDate = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}-01`; // 1日を固定で追加

  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              textAlign: "center",
            }}
          >
            {/* <div className={`fixed top-0 left-0 w-full h-screen z-[100]`}>
              <Image
                src="/image/home.jpg"
                alt="Sample Image"
                width={1670}
                height={800}
                style={{ marginTop: "-5px" }}
              />
            </div> */}
            <div className={`fixed top-0 left-0 w-full h-screen z-[100]`}>
              {/* characterStatusの値に応じて画像を切り替え */}
              {characterStatus === 3 ? (
                 <>
                <h1 style={{ color: '#ff4500' }}>あと{life}ヶ月生活できそうです</h1>
                <Image
                  src="/image/warning.png"
                  alt="Character 1"
                  width={300}
                  height={300}
                />
                </>
              ) : characterStatus === 2 ? (
                <>
                <h1 style={{ color: '#ffd700' }}>あと{life}ヶ月生活できそうです</h1>
                <Image
                  src="/image/caution.png"
                  alt="Character 2"
                  width={300}
                  height={300}
                />
                </>
              ) : characterStatus === 1 ? (
                <>
                <h1 style={{ color: '#4169e1' }}>あと{life}ヶ月生活できそうです</h1>
                <Image
                src="/image/stable.png"
                alt="Character 3"
                width={300}
                height={300}
              />
              </>
              ) : (
                <p>設定→生存期間設定から情報を登録してください。<br />
                  予算を設定することで今月の予算から過去12ヶ月分を取得し、生存期間を算出します。
                </p>
              )}
            </div>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
