import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/db";

const getTrack = async (id: string) => {
  try {
    const trackRef = doc(db, "tracks", id);
    const track = await getDoc(trackRef);

    if (track.exists()) {
      return { id, ...track.data() };
    } else {
      console.log(`[API] Track ${id} not found`);
      return {};
    }
  } catch (error) {
    console.error("[API] Error getting track:", error);
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
