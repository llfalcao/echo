import clientPromise from "@/utils/db";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll("id");

  if (!ids.length) {
    return new Response("Query should contain at least one playlist id", {
      status: 400,
    });
  }

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
    ])
    .toArray();

  return new Response(JSON.stringify(data));
};
