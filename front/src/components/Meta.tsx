import Head from "next/head";

const Meta = () => {
  return (
    <Head>
      <title>BalanceDays</title>
      <meta name="description" content="このサイトの説明" />
      <meta property="og:title" content="BalanceDays" />
      <meta property="og:description" content="貯金残高からあとどのくらい生活できるかを判定してくれるアプリです。" />
      <meta property="og:image" content="https://myapp-three-rho.vercel.app/image/stable.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://myapp-three-rho.vercel.app/" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
    </Head>
  );
};

export default Meta;
