import clientPromise from "@/utils/db";

interface Options {
  params: {
    id: string;
  };
}

export const GET = async (request: Request, { params: { id } }: Options) => {
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

    if (!data) {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(JSON.stringify(data));
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
};
