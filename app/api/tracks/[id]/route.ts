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
      .collection("tracks")
      .findOne({ id }, { projection: { _id: 0 } });

    if (!data) {
      return new Response("Not Found", { status: 404 });
    }

    return new Response(JSON.stringify(data));
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
};
