/* eslint-disable react-hooks/exhaustive-deps */
import { Playlist } from "@/typings/AudioPlayer";
import { useEffect, useRef, useState } from "react";
import { useBetween } from "use-between";

const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [current, setCurrent] = useState<number>(0);
  const [repeat, setRepeat] = useState<"none" | "song" | "playlist">("none");
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [originalPlaylist, setOriginalPlaylist] = useState<Playlist>();
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [clickedTime, setClickedTime] = useState<number | undefined>();

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

  const onShuffle = () => {
    if (!playlist?.tracks || !originalPlaylist?.tracks) return;

    if (!shuffle) {
      const previousTracks = playlist.tracks.slice(0, current + 1);
      let target = playlist.tracks.slice(current + 1);

      for (let i = 0; i < target.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [target[i], target[j]] = [target[j], target[i]];
      }

      const shuffled = [...previousTracks, ...target];
      setPlaylist({ ...playlist, tracks: shuffled });
      setShuffle(true);
    } else {
      const currentTrack = originalPlaylist.tracks.indexOf(
        playlist.tracks[current],
      );

      const previousTracks = originalPlaylist.tracks.slice(0, currentTrack + 1);
      const unshuffled = [
        ...previousTracks,
        ...originalPlaylist.tracks.slice(currentTrack + 1),
      ];

      setPlaylist({ ...playlist, tracks: unshuffled });
      setShuffle(false);
    }
  };

  const onLoadedData = () => {
    setCurrentTime(audio.current?.currentTime);
    setDuration(audio.current?.duration);
  };

  const onTimeUpdate = () => setCurrentTime(audio.current?.currentTime);

  useEffect(() => {
    if (audio.current && clickedTime) {
      audio.current.currentTime = clickedTime;
    }
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    audio.current?.addEventListener("play", onPlay);
    audio.current?.addEventListener("pause", onPause);
    audio.current?.addEventListener("ended", () => onNext("ended"));
    audio.current?.addEventListener("timeupdate", onTimeUpdate);
    audio.current?.addEventListener("loadeddata", onLoadedData);

    return () => {
      audio.current?.removeEventListener("play", onPlay);
      audio.current?.removeEventListener("pause", onPause);
      audio.current?.removeEventListener("ended", () => onNext("ended"));
      audio.current?.removeEventListener("timeupdate", onTimeUpdate);
      audio.current?.removeEventListener("loadeddata", onLoadedData);
    };
  }, [audio, src, playlist, clickedTime]);

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

    if (playlist.id !== originalPlaylist?.id) {
      setOriginalPlaylist(playlist);
    }

    fetch(`/api/audio/${playlist.tracks[current]}`)
      .then((res) => res.json())
      .then((data) => setSrc(data.src));
  }, [playlist?.id, current]);

  return {
    audio,
    playing,
    src,
    repeat,
    shuffle,
    currentTime,
    duration,
    clickedTime,
    setClickedTime,
    setPlaylist,
    onPlay,
    onPause,
    onPrevious,
    onNext,
    onRepeat,
    onShuffle,
  };
};

const useAudioPlayer = () => useBetween(AudioPlayer);
export default useAudioPlayer;
