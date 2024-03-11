import { getPlaylists } from ".";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url!);
  const ids = searchParams.get("ids");

  if (!ids) {
    return Response.json("400 Bad Request", { status: 400 });
  }

  const playlists = await getPlaylists(ids.split(","));
  return Response.json(playlists, { status: 200 });
}
