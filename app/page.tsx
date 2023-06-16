import { Metadata } from "next";
import HomePage from ".";
import clientPromise from "@/utils/db";

export interface FeaturedContent {
  title?: string;
  content: {
    type: "playlist" | "track";
    ids: string[];
    data: Playlist[];
  };
  imagePriority?: boolean;
}

const playlistIds = process.env.HOME_PLAYLISTS?.split(",") ?? [];

const featuredContent: FeaturedContent[] = [
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

const getPlaylists = async () => {
  const client = await clientPromise;
  const db = client.db();
  const data = await db
    .collection("playlists")
    .aggregate<Playlist>([
      {
        $match: {
          id: {
            $in: playlistIds,
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          title: 1,
          cover_image: 1,
          tracks: 1,
        },
      },
      {
        $lookup: {
          from: "tracks",
          localField: "tracks",
          foreignField: "id",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                yid: 1,
                title: 1,
                cover_image: 1,
                lyrics: 1,
              },
            },
          ],
          as: "tracks",
        },
      },
    ])
    .toArray();

  return data;
};

const Page = async () => {
  const playlists = await getPlaylists();
  const content = featuredContent.map((item) => ({
    ...item,
    content: {
      ...item.content,
      data: playlists.filter((playlist) =>
        item.content.ids.some((id) => id === playlist.id),
      ),
    },
  }));

  return <HomePage content={content} />;
};

export const metadata: Metadata = {
  title: "re:tune",
  description: "re:tune web player",
  viewport: "width=device-width, initial-scale=1",
};

export default Page;
