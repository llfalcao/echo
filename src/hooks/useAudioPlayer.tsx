/* eslint-disable react-hooks/exhaustive-deps */
import { Playlist } from "@/typings/AudioPlayer";
import { useEffect, useRef, useState } from "react";

const useAudioPlayer = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [current, setCurrent] = useState<number>(0);

  const onPlay = () => {
    setPlaying(true);
    audio.current?.play();
  };

  const onPause = () => {
    setPlaying(false);
    audio.current?.pause();
  };

  const onNext = () => {
    if (playlist?.tracks[current + 1]) {
      setCurrent(current + 1);
      setPlaying(true);
    }
  };

  useEffect(() => {
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    audio.current?.addEventListener("play", onPlay);
    audio.current?.addEventListener("pause", onPause);
    audio.current?.addEventListener("ended", onNext);

    return () => {
      audio.current?.removeEventListener("play", onPlay);
      audio.current?.removeEventListener("pause", onPause);
      audio.current?.removeEventListener("ended", onNext);
    };
  }, [audio, playlist]);

  useEffect(() => {
    if (typeof window !== "undefined" && audio.current) {
      audio.current.src = src;
      audio.current.load();

      if (playing) {
        audio.current.play();
      }
    }
  }, [src]);

  useEffect(() => {
    if (!playlist) return;

    fetch(`/api/audio/${playlist?.tracks[current]}`)
      .then((res) => res.json())
      .then((data) => setSrc(data.src));
  }, [playlist?.id, current]);

  return {
    audio,
    playing,
    src,
    setSrc,
    onPlay,
    onPause,
    onNext,
    setPlaylist,
  };
};

export default useAudioPlayer;
