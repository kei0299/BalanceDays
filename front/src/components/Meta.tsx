import Head from "next/head";

const Meta = () => {
  return (
    <Head>
      <title>サイト名</title>
      <meta name="description" content="このサイトの説明" />
      <meta property="og:title" content="サイト名" />
      <meta property="og:description" content="このサイトの説明" />
      <meta property="og:image" content="/image/stable.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://myapp-three-rho.vercel.app/" />
    </Head>
  );
};

export default Meta;
