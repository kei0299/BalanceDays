import Link from "next/link";

const FooterTop = () => {
  return (
    <footer className="test">
      <div><Link href="/">利用規約</Link></div>
      <div><Link href="/">プライバシーポリシー</Link></div>
    </footer>
  );
};

export default FooterTop;
