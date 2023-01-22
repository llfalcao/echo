import Link from "next/link";
import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Header() {
  return (
    <ul style={inter.style}>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/player">Player</Link>
      </li>
    </ul>
  );
}
