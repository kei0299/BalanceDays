import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const Meta = ({
  title = "デフォルトタイトル",
  description = "サイトの説明",
  image = "/ogp_default.png",
  url = "https://あなたのサイト.com",
}: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="あなたのサイト名" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
