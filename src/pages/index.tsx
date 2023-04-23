import Head from "next/head";
import { NextPage } from "next";
import Featured from "@/components/Featured";

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
        title="Trending (playlists)"
        content={{ type: "playlist", ids: ["9vQBpbcmSqaPz59ZEurUa"] }}
        imagePriority={true}
      />
      <Featured
        title="Famously Unknown (songs)"
        content={{ type: "track", ids: ["9vQBpbcmSqaPz59ZEurUa"] }}
        imagePriority={true}
      />
    </>
  );
};

export default Home;
