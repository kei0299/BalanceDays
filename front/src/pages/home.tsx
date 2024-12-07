import { Box } from "@mui/material";
import Header from "@/components/header";
import FooterLogin from "@/components/footerLogin";
import { useState, useEffect } from "react";
import { checkSession } from "@/utils/auth/checkSession";
import Image from "next/image";
import { fetchCharacter } from "@/utils/auth/fetchCharacter";

export default function Home() {
  const currentMonth: Date = new Date();
  
  useEffect(() => {
    // 非同期関数を定義してセッション情報を取得
    const fetchSessionData = async () => {
      try {
        const sessionData = await checkSession(); // checkSessionの結果を取得
        console.log(sessionData); // データをログに出力
      } catch (error) {
        console.error("セッションチェックエラー", error);
      }
    };

    const fetchBudgetData = async () => {
      try {
        const data = await fetchCharacter(apiFormattedDate); // APIから取得したデータが BudgetRowData[] に対応
        //     const formattedData: BudgetRowData[] = data.map((item) => ({
        //       id: item.id,
        //       category: item.name,
        //       lastMonthExpense: item.last_month_expense,
        //       budget: String(item.budget),
        //       currentMonth: String(item.currentMonth),
        //     }));
        console.log(data);
        //     setBudgets(formattedData);
        //     setSumBudget(sumData);
      } catch (error) {
        console.error("取得失敗", error);
      }
    };

    fetchBudgetData();
    fetchSessionData(); // 初回レンダリング時にセッション情報を取得
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
            <div className={`fixed top-0 left-0 w-full h-screen z-[100]`}>
              <Image
                src="/image/home.jpg"
                alt="Sample Image"
                width={1670}
                height={800}
                style={{ marginTop: "-5px" }}
              />
            </div>
          </Box>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}
