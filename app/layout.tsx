import { Metadata } from "next";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";
import "@/styles/index.scss";

export const metadata: Metadata = {
  title: "re:tune | Web Player",
  description: "For songs lost in time",
  icons: {
    shortcut: "/favicon.ico",
    icon: "/favicon.ico",
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <Sidebar />
          <Player />
          <div className="container">
            <Header />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
