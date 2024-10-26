import Link from "next/link";

const Header = () => {
  return (
    <header className="test">
      <h1>BalanceDays</h1>
      <Link href="/">help</Link>
      <div><Link href="/">Back</Link></div>
      <div><Link href="/">通知</Link></div>
    </header>
  );
};

export default Header;
