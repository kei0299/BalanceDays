import Header from "@/components/header";
import Footer from "@/components/footerTop";
import styles from "@/styles/Home.module.css";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <h1>サービス説明</h1>
          <Button variant="contained" color="info">新規作成</Button>
          <Button variant="outlined">ログイン</Button>
        </main>
        <Footer />
      </div>
    </>
  );
}
