import type { AppProps } from "next/app";
import Head from "next/head";

import Header from "@/components/Header";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";

import PlayerContextProvider from "@/context/Player";
import "@/styles/index.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div id="root">
      <Head>
        <title>re:tune | Web Player</title>
        <meta name="description" content="For songs lost in time" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <PlayerContextProvider>
        <Sidebar />
        <Player />
        <div className="container">
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </PlayerContextProvider>
    </div>
  );
}
