import Head from "next/head";
import { NextPage } from "next";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>re:tune</title>
        <meta name="description" content="re:tune web player" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={inter.style}>
        <h1>re:tune</h1>
      </main>
    </>
  );
};

export default Home;
