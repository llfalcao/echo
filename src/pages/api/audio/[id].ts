import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";
import distubeYtdl from "@distube/ytdl-core";
import youtubedl from "youtube-dl-exec";

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
    console.error("# ytdl-core failed, attempting to use distube \n", error);
  }

  try {
    const { formats } = await distubeYtdl.getInfo(url);
    const format = distubeYtdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return format?.url;
  } catch (error) {
    console.error("# distube failed, attempting to use youtube-dl \n", error);
  }

  try {
    const url = await youtubedl(`https://www.youtube.com/watch?v=${yid}`, {
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      audioFormat: "opus",
      getUrl: true,
      extractAudio: true,
      audioQuality: 0,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    return url;
  } catch (error) {
    console.error("# youtubedl failed \n", error);
    throw Error("Failed to fetch track");
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
