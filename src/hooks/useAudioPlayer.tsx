/* eslint-disable react-hooks/exhaustive-deps */
import { Playlist } from "@/typings/AudioPlayer";
import { useEffect, useState } from "react";

const useAudioPlayer = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio(src));
    }
  }, [src]);

  const onPlay = () => {
    setPlaying(true);
    audio?.play();
  };

  const onPause = () => {
    setPlaying(false);
    audio?.pause();
  };

  useEffect(() => {
    audio?.addEventListener("ended", onPause);

    return () => {
      audio?.removeEventListener("ended", onPause);
    };
  }, [audio]);

  useEffect(() => {
    if (!playlist) return;

    fetch(`/api/audio/${playlist?.tracks[0]}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("# data", data);
        setSrc(data.src);
      });
  }, [playlist?.id]);

  return {
    playing,
    src,
    setSrc,
    onPause,
    onPlay,
    setPlaylist,
  };
};

export default useAudioPlayer;
