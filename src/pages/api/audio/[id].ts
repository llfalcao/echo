import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

const fetchTrack = async (yid: string) => {
  const url = `https://www.youtube.com/watch?v=${yid}`;
  const { formats } = await ytdl.getInfo(url);
  const audio = formats.find(
    (format) =>
      format.mimeType?.includes("audio") &&
      ((format.audioQuality as any) === "AUDIO_QUALITY_HIGH" ||
        format.audioQuality === "AUDIO_QUALITY_MEDIUM" ||
        format.audioQuality === "AUDIO_QUALITY_LOW"),
  );

  return audio?.url;
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
