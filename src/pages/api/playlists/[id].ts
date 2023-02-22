import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const getPlaylist = async (id: string) => {
  try {
    const client = await clientPromise;
    const db = client.db();
    const objectId = new ObjectId(id);
    const data = await db
      .collection("playlists")
      .aggregate([
        {
          $match: {
            _id: objectId,
          },
        },
        {
          $project: {
            _id: 1,
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
                  _id: 1,
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

    console.log("# out", data);
    return data[0];
  } catch (e) {
    console.error(e);
    return {};
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse, // <Playlist>
) {
  const { id } = req.query;

  if (typeof id === "string") {
    const playlist = await getPlaylist(id);
    res.status(200).json(playlist);
  } else {
    res.status(404).send("404 Not Found");
  }
}
