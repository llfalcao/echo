import Featured from "@/components/Featured";
import { Viewport } from "next";
import { getPlaylists } from "./api/playlists";

export interface FeaturedContent {
  title?: string;
  content: {
    type: "playlist" | "track";
    ids: string[];
    data: Playlist[];
  };
  imagePriority?: boolean;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

async function getContent() {
  const playlistIds = process.env.HOME_PLAYLISTS?.split(",") ?? [];

  let content: FeaturedContent[] = [
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
        ids: process.env.HOME_FEATURED_PLAYLIST_2?.split(",") ?? [],
        data: [],
      },
      imagePriority: true,
    },
  ];

  return { playlistIds, content };
}

export default async function Home() {
  const { playlistIds, content } = await getContent();
  const playlists = await getPlaylists(playlistIds);

  const data = content.map((item) => ({
    ...item,
    content: {
      ...item.content,
      data: playlists.filter((playlist) =>
        item.content.ids.some((id) => id === playlist.id),
      ),
    },
  }));

  const currentHour = new Date().getHours();
  const welcomeMessage =
    currentHour > 4 && currentHour < 12
      ? "Good morning!"
      : currentHour >= 12 && currentHour < 18
        ? "Good afternoon!"
        : "Good evening!";

  return (
    <>
      <h1>{welcomeMessage}</h1>

      {data.map((item) => (
        <Featured key={item.title} {...item} />
      ))}
    </>
  );
}
