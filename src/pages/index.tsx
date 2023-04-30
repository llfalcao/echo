import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import Featured from "@/components/Featured";

import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from "firebase/firestore";

import { Timestamp } from "firebase/firestore";
import { db } from "@/utils/db";
import { getPlaylist } from "./api/playlists/[id]";
import { AppContext } from "next/app";

export interface FeaturedContent {
  title?: string;
  content: {
    type: "playlist" | "track";
    ids: string[];
    data: Playlist[];
  };
  imagePriority?: boolean;
}
interface HomeProps {
  featuredContent: FeaturedContent[];
}

const Home: NextPage<HomeProps> = ({ featuredContent = [] }) => {
  return (
    <>
      <Head>
        <title>re:tune</title>
        <meta name="description" content="re:tune web player" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1>Home</h1>

      {featuredContent.map((item) => (
        <Featured key={item.title} {...item} />
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  featuredContent: FeaturedContent[];
}> = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59",
  );

  const playlistsToFetch = ["Ofa4kLSbRe90LZCf9uS1"];

  const featuredContent: FeaturedContent[] = [
    {
      title: "Top 10",
      content: { type: "track", ids: ["Ofa4kLSbRe90LZCf9uS1"], data: [] },
      imagePriority: true,
    },
    {
      title: "By genre",
      content: { type: "playlist", ids: ["Ofa4kLSbRe90LZCf9uS1"], data: [] },
      imagePriority: true,
    },
  ];

  const fetchData = async () => {
    const playlists = await Promise.all(
      playlistsToFetch.map(async (id) => await getPlaylist(id)),
    );

    return playlists.filter((playlist) => playlist !== null) as Playlist[];
  };

  const playlistData = await fetchData();

  featuredContent.forEach((item) => {
    item.content.data = playlistData.filter((playlist) =>
      item.content.ids.some((id) => id === playlist.id),
    );
  });

  return {
    props: {
      featuredContent,
    },
  };
};

export default Home;
