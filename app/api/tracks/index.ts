import clientPromise from "@/utils/db";

export const getTrack = async (id: string): Promise<Track | null> => {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db
      .collection<Track>("tracks")
      .findOne({ id }, { projection: { _id: 0 } });

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    return null;
  }
};
