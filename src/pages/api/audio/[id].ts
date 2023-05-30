import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";
import distubeYtdl from "@distube/ytdl-core";

const fetchTrack = async (yid: string) => {
  const url = `https://www.youtube.com/watch?v=${yid}`;
  try {
    const { formats } = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return format?.url;
  } catch (error) {
    console.error("# ytdl-core failed, using @distube/ytdl-core", error);
    const { formats } = await distubeYtdl.getInfo(url);
    const format = distubeYtdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return format?.url;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  try {
    if (typeof id === "string") {
      const track = await fetchTrack(id);

      if (track) {
        return res.status(200).json({ src: track });
      }
    }
  } catch (error) {
    res.status(404).send(error ?? "404 Not Found");
  }
}
