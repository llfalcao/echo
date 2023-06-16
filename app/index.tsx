"use client";

import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Featured from "@/components/Featured";
import { FeaturedContent } from "./page";

interface Props {
  content: FeaturedContent[];
}

const Home: NextPage<Props> = ({ content }) => {
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    setWelcomeMessage(
      currentHour > 4 && currentHour < 12
        ? "Good morning"
        : currentHour >= 12 && currentHour < 18
        ? "Good afternoon"
        : "Good evening",
    );
  }, []);

  return (
    <>
      <Head>
        <title>re:tune</title>
        <meta name="description" content="re:tune web player" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1>{welcomeMessage}!</h1>

      {content.map((item) => (
        <Featured key={item.title} {...item} />
      ))}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const playlistIds = process.env.HOME_PLAYLISTS?.split(",") ?? [];

  const content: FeaturedContent[] = [
    {
      title: "Top 10",
      content: {
        type: "track",
        ids: process.env.HOME_FEATURED_PLAYLIST_1?.split(",") ?? [],
        data: [],
      },
      imagePriority: true,
    },
    {
      title: "By genre",
      content: {
        type: "playlist",
        ids: process.env.HOME_FEATURED_PLAYLIST_1?.split(",") ?? [],
        data: [],
      },
      imagePriority: true,
    },
  ];

  return {
    props: {
      playlistIds,
      content,
    },
  };
};

export default Home;
