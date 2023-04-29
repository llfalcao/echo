import Head from "next/head";
import { NextPage } from "next";
import Featured from "@/components/Featured";
import clientPromise from "@/lib/mongodb";

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

export async function getServerSideProps() {
  const featuredContent: FeaturedContent[] = [
    {
      title: "Trending (playlists)",
      content: { type: "playlist", ids: ["9vQBpbcmSqaPz59ZEurUa"], data: [] },
      imagePriority: true,
    },
    {
      title: "Famously Unknown (songs)",
      content: { type: "track", ids: ["9vQBpbcmSqaPz59ZEurUa"], data: [] },
      imagePriority: true,
    },
  ];

  const fetchData = async () => {
    const getPlaylist = async (id: string) => {
      try {
        const client = await clientPromise;
        const db = client.db();
        const data = await db
          .collection("playlists")
          .aggregate([
            {
              $match: {
                id,
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
            {
              $limit: 1,
            },
          ])
          .next();

        return data;
      } catch (e) {
        console.error(e);
        return {};
      }
    };

    const getPlaylistMetadata = async (id: string) => {
      try {
        const client = await clientPromise;
        const db = client.db();
        const data = await db.collection("playlists").findOne(
          {
            id,
          },
          {
            projection: {
              _id: 0,
              id: 1,
              title: 1,
              cover_image: 1,
            },
          },
        );

        return data;
      } catch (e) {
        console.error(e);
        return {};
      }
    };

    try {
      const promises = featuredContent.map(async (item) => {
        const { ids } = item.content;
        const data = await Promise.all(
          ids.map(async (id) => {
            const minimal =
              item.content.type === "playlist" ? "?minimal=1" : "";

            if (minimal) {
              return await getPlaylistMetadata(id);
            }

            return await getPlaylist(id);
          }),
        );

        item.content.data = data as Playlist[];
        return item;
      });

      return await Promise.all(promises);
    } catch (error) {
      console.error("# error");
      return { props: {} };
    }
  };

  const updatedContent = await fetchData();

  return {
    props: {
      featuredContent: updatedContent,
    },
  };
}

export default Home;
