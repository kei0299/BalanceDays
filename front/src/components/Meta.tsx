import Head from "next/head";

const Meta = () => {
  return (
    <Head>
      <title>BalanceDays</title>
      <meta name="description" content="このサイトの説明" />
      <meta property="og:title" content="BalanceDays" />
      <meta property="og:description" content="貯金残高からあとどのくらい生活できるかを判定してくれるアプリです。" />
      <meta property="og:image" content="/image/stable.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://myapp-three-rho.vercel.app/" />
    </Head>
  );
};

export default Meta;
