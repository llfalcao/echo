import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse, // <Playlist>
) {
  const { id } = req.query;

  const tmpPlaylist = [
    {
      id: 1,
      tracks: ["J_sRkv-cNbU", "keuSMpUEdeQ", "HSDdRxAEdcs"],
    },
    {
      id: 2,
      tracks: ["yJg-Y5byMMw", "p7ZsBPK656s", "jK2aIUmmdP4"],
    },
  ];

  if (typeof id === "string") {
    res
      .status(200)
      .json(tmpPlaylist.find((playlist) => playlist.id === parseInt(id)));
  } else {
    res.status(404).send("404 Not Found");
  }
}
