import clientPromise from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

const getTrack = async (id: string) => {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db
      .collection("tracks")
      .findOne({ id }, { projection: { _id: 0 } });

    return data;
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
    const track = await getTrack(id);
    res.status(200).json(track);
  } else {
    res.status(404).send("404 Not Found");
  }
}
