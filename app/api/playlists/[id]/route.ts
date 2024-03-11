import { getPlaylist, getPlaylistMetadata } from "..";

interface ContextProps {
  params: {
    id: string;
    minimal?: string;
  };
}

export async function GET(_request: Request, { params }: ContextProps) {
  const { id, minimal } = params;

  try {
    if (typeof id === "string") {
      if (minimal === "1") {
        const playlist = await getPlaylistMetadata(id);
        return Response.json(playlist);
      }

      const playlist = await getPlaylist(id);

      if (playlist) {
        return Response.json(playlist);
      }
    }

    return Response.json("Not Found", { status: 404 });
  } catch (_error) {
    return Response.json("Internal Server Error", { status: 500 });
  }
}
