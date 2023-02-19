import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse, // <Playlist>
) {
  const { id } = req.query;

  const tmpPlaylist = [
    {
      id: 1,
      title: "Rock",
      tracks: ["J_sRkv-cNbU", "keuSMpUEdeQ", "HSDdRxAEdcs"],
      image: "https://i.imgur.com/eGctkzU.jpg",
    },
    {
      id: 2,
      title: "Dubstep",
      tracks: ["yJg-Y5byMMw", "p7ZsBPK656s", "jK2aIUmmdP4"],
      image: "https://i.imgur.com/YAgH36N.jpg",
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
