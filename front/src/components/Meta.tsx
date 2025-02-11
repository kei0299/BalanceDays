import Head from "next/head";

const Meta = () => {
  return (
    <Head>
      <title>BalanceDays</title>
      <meta property="og:title" content="BalanceDays | 家計簿で生活可能日数を算出" />
      <meta property="og:description" content="貯金残高から、あと何日生活できるかをシンプルに計算。未来の計画を立てやすくする便利なアプリです。" />
      <meta property="og:image" content="https://myapp-three-rho.vercel.app/image/stable.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://myapp-three-rho.vercel.app/" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
    </Head>
  );
};

export default Meta;
