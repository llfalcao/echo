import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse, // <Playlist>
) {
  // const { id } = req.query;

  const tmpPlaylist = [
    {
      id: 1,
      tracks: ["yJg-Y5byMMw", "p7ZsBPK656s", "jK2aIUmmdP4"],
    },
  ];

  res.status(200).json(tmpPlaylist[0]);
}
