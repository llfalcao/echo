/* eslint-disable react-hooks/exhaustive-deps */
import { Playlist } from "@/typings/AudioPlayer";
import { useEffect, useRef, useState } from "react";

const useAudioPlayer = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [current, setCurrent] = useState<number>(0);
  const [repeat, setRepeat] = useState<"none" | "song" | "playlist">("none");

  const onPlay = () => {
    setPlaying(true);
    audio.current?.play();
  };

  const onPause = () => {
    setPlaying(false);
    audio.current?.pause();
  };

  const onPrevious = () => {
    if (playlist?.tracks[current - 1]) {
      setCurrent(current - 1);
    }
  };

  const onNext = (event?: string) => {
    if (!playlist?.tracks) return;
    const hasNext = playlist.tracks[current + 1] !== undefined;
    const isLast = playlist.tracks.length - 1 === current;

    if (repeat === "song" && audio.current) {
      audio.current.currentTime = 0;
    } else if (repeat === "playlist" && isLast) {
      setCurrent(0);
    } else if (hasNext) {
      setCurrent(current + 1);
    }

    if (hasNext && event === "ended") {
      setPlaying(true);
    }
  };

  const onRepeat = () => {
    if (audio.current) {
      if (repeat === "none") {
        setRepeat("song");
        audio.current.loop = true;
        return;
      }

      if (repeat === "song") {
        audio.current.loop = false;
        return setRepeat("playlist");
      }

      audio.current.loop = false;
    }
    setRepeat("none");
  };

  useEffect(() => {
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    audio.current?.addEventListener("play", onPlay);
    audio.current?.addEventListener("pause", onPause);
    audio.current?.addEventListener("ended", () => onNext("ended"));

    return () => {
      audio.current?.removeEventListener("play", onPlay);
      audio.current?.removeEventListener("pause", onPause);
      audio.current?.removeEventListener("ended", () => onNext("ended"));
    };
  }, [audio, src, playlist]);

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
    setPlaylist,
    onPlay,
    onPause,
    onPrevious,
    onNext,
    onRepeat,
  };
};

export default useAudioPlayer;
