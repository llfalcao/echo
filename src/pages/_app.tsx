import type { AppProps } from "next/app";
import Head from "next/head";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Player from "@/components/Player";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div id="root">
      <Head>
        <title>re:tune | Web Player</title>
        <meta name="description" content="For songs lost in time" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Sidebar />
      <div className="container">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
      <Player />
    </div>
  );
}
