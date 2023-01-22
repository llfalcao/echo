import { Inter } from "@next/font/google";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>re:tune - Player</title>
        <meta name="description" content="re:tune web player" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={inter.className}>Player</h1>
    </>
  );
};

export default LandingPage;
