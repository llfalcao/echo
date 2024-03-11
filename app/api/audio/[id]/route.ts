import { fetchTrack } from "..";

interface ContextParams {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: ContextParams) {
  const { id } = params;

  try {
    if (typeof id === "string") {
      const track = await fetchTrack(id);

      if (track) {
        return Response.json({ src: track }, { status: 200 });
      }
    }

    return Response.json("404 Not Found", { status: 404 });
  } catch (_error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
