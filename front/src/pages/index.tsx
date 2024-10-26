import Header from "@/components/header";
import Footer from "@/components/footerTop";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <title>BalanceDays</title>
      <link rel="icon" href="/favicon.ico" />
      <div>
        <main>
          <h1>サービス説明</h1>
          <button>新規作成</button>
          <button>ログイン</button>
        </main>
        <Footer />
      </div>
    </>
  );
}
