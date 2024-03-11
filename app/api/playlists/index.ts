import clientPromise from "@/utils/db";

export const getPlaylists = async (
  ids: string[],
  page: number = 1,
): Promise<Playlist[]> => {
  const skip = page <= 1 ? 0 : page * 10;
  const pageSize = page * 10;

  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db
      .collection("playlists")
      .aggregate<Playlist>([
        {
          $match: {
            id: {
              $in: ids,
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
            // Slice tracks for pagination
            let: {
              trackIds: {
                $slice: ["$tracks", skip, pageSize],
              },
            },
            localField: "tracks",
            foreignField: "id",
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$id", "$$trackIds"] },
                },
              },
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return [];
  }
};

export const getPlaylist = async (
  id: string,
  page: number = 1,
): Promise<Playlist | null> => {
  const skip = page <= 1 ? 0 : page * 10;
  const pageSize = page * 10;

  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db
      .collection("playlists")
      .aggregate<Playlist>([
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
            let: { trackIds: { $slice: ["$tracks", skip, pageSize] } },
            localField: "tracks",
            foreignField: "id",
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$id", "$$trackIds"] },
                },
              },
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return null;
  }
};

export const getPlaylistMetadata = async (id: string) => {
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return {};
  }
};
