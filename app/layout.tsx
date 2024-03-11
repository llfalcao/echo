import Header from "@/components/Header";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import PlayerContextProvider from "@/context/Player";
import "@/styles/index.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "echo",
  description: "Discover lost songs.",
  icons: [{ rel: "shotcut icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <div id="root">
            <PlayerContextProvider>
              <Sidebar />
              <Player />
              <div className="container">
                <Header />
                <main>{children}</main>
              </div>
            </PlayerContextProvider>
          </div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
