import Head from "next/head";
import { NextPage } from "next";
import Featured from "@/components/Featured";
import Card from "@/components/Card";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>re:tune</title>
        <meta name="description" content="re:tune web player" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1>Home</h1>
      <Featured
        title="Trending"
        content={{ type: "playlist", ids: ["63f55db2996f801071b43ccf"] }}
        imagePriority={true}
      />
    </>
  );
};

export default Home;
