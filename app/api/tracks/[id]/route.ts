import { getTrack } from "..";

interface ContextProps {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: ContextProps) {
  const { id } = params;

  if (typeof id === "string") {
    const track = await getTrack(id);
    return Response.json(track, { status: 200 });
  } else {
    return Response.json("Not Found", { status: 404 });
  }
}
