import clientPromise from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export const getPlaylist = async (id: string, page: number = 1) => {
  const skip = page <= 1 ? 0 : page * 10;
  const pageSize = page * 3;

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
  } catch (e) {
    console.error(e);
    return {};
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
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, minimal } = req.query;

  if (typeof id === "string") {
    if (minimal === "1") {
      const playlist = await getPlaylistMetadata(id);
      return res.json(playlist);
    }

    const playlist = await getPlaylist(id);
    res.json(playlist);
  } else {
    res.status(404).send("404 Not Found");
  }
}
