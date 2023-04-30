import type { NextApiRequest, NextApiResponse } from "next";
import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/utils/db";

interface TrackTimestamp {
  seconds: number;
  nanoseconds: number;
}

export const convertTimestamp = ({ seconds, nanoseconds }: TrackTimestamp) => {
  return new Timestamp(seconds, nanoseconds).toDate().toISOString();
};

export const getPlaylist = async (id: string) => {
  try {
    const playlistRef = doc(db, "playlists", id);
    const playlistDoc = await getDoc(playlistRef);
    const { created_at, updated_at } = playlistDoc.data() ?? {};

    if (playlistDoc.exists()) {
      const trackRefs: DocumentReference<DocumentData>[] =
        playlistDoc.data().tracks ?? [];

      const tracks = await Promise.all(
        trackRefs.map(async (ref) => {
          const trackDoc = await getDoc(ref);
          const { added_at, updated_at } = trackDoc.data() ?? {};

          return {
            id: trackDoc.id,
            ...trackDoc.data(),
            added_at: convertTimestamp(added_at),
            updated_at: convertTimestamp(updated_at),
          } as Track;
        }),
      );

      return {
        id: playlistDoc.id,
        ...playlistDoc.data(),
        created_at: convertTimestamp(created_at),
        updated_at: convertTimestamp(updated_at),
        tracks,
      } as Playlist;
    } else {
      console.log(`[API] Playlist ${id} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error getting playlist:", error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (typeof id === "string") {
    const playlist = await getPlaylist(id);

    if (playlist) {
      return res.json(playlist);
    }

    res.status(404).send("404 Not Found");
  }

  res.status(400).send("400 Bad Request");
}
