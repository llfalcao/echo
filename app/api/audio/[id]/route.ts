import ytdl from "ytdl-core";
import distubeYtdl from "@distube/ytdl-core";
import youtubedl from "youtube-dl-exec";

interface Options {
  params: {
    id: string;
  };
}

export const GET = async (request: Request, { params: { id } }: Options) => {
  const url = `https://www.youtube.com/watch?v=${id}`;

  try {
    const { formats } = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return new Response(JSON.stringify({ src: format?.url }));
  } catch (error) {
    console.error("# ytdl-core failed, attempting to use distube \n", error);
  }

  try {
    const { formats } = await distubeYtdl.getInfo(url);
    const format = distubeYtdl.chooseFormat(formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    return new Response(JSON.stringify({ src: format?.url }));
  } catch (error) {
    console.error("# distube failed, attempting to use youtube-dl \n", error);
  }

  try {
    const { url } = await youtubedl(`https://www.youtube.com/watch?v=${id}`, {
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      audioFormat: "opus",
      dumpJson: true,
      extractAudio: true,
      audioQuality: 0,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    return new Response(JSON.stringify({ src: url }));
  } catch (error) {
    console.error("# youtubedl failed \n", error);
    return new Response("Failed to fetch track", { status: 500 });
  }
};
