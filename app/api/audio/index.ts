import distubeYtdl from "@distube/ytdl-core";
import youtubedl from "youtube-dl-exec";
import ytdl from "ytdl-core";

export const fetchTrack = async (yid: string) => {
  const url = `https://www.youtube.com/watch?v=${yid}`;

  try {
    const { formats } = await distubeYtdl.getInfo(url);
    const format = distubeYtdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return format?.url;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("# distube failed, attempting to use youtube-dl \n", error);
    }
  }

  try {
    const { formats } = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return format?.url;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("# ytdl-core failed, attempting to use distube \n", error);
    }
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
    if (process.env.NODE_ENV === "development") {
      console.error("# youtubedl failed \n", error);
    }
    throw Error("Failed to fetch track");
  }
};
