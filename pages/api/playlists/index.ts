import clientPromise from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export const getPlaylists = async (ids: string[], page: number = 1) => {
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
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { ids } = req.query;

  if (typeof ids === "string") {
    const playlists = await getPlaylists(ids.split(","));
    return res.status(200).json(playlists);
  }

  res.status(400).send("400 Bad Request");
}
