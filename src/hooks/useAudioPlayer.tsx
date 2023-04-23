/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useBetween } from "use-between";

interface Player {
  playlist?: Playlist;
  current: number;
  userInteracted: boolean;
}

const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [player, setPlayer] = useState<Player>({
    playlist: undefined,
    current: 0,
    userInteracted: false,
  });
  const [src, setSrc] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<"none" | "song" | "playlist">("none");
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [originalPlaylist, setOriginalPlaylist] = useState<Playlist>();
  const [currentTime, setCurrentTime] = useState<number | undefined>(0);
  const [duration, setDuration] = useState<number | undefined>(0);
  const [clickedTime, setClickedTime] = useState<number | undefined>();
  const [volume, setVolume] = useState<number | undefined>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const onPlay = () => {
    setPlaying(true);
    audio.current?.play();
  };

  const onPause = () => {
    setPlaying(false);
    audio.current?.pause();
  };

  const onPrevious = () => {
    if (player.playlist?.tracks[player.current - 1]) {
      setPlayer({ ...player, current: player.current - 1 });
    }
  };

  const onNext = () => {
    if (!player.playlist?.tracks || !audio.current) return;
    const hasNext = player.playlist.tracks[player.current + 1] !== undefined;
    const isLast = player.playlist.tracks.length - 1 === player.current;

    if (repeat === "song") {
      audio.current.currentTime = 0;
    } else if (repeat === "playlist" && isLast) {
      setPlayer({ ...player, current: 0 });
    } else if (hasNext) {
      setPlayer({ ...player, current: player.current + 1 });
    }

    if (hasNext && audio.current.ended) {
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
    if (!player.playlist?.tracks || !originalPlaylist?.tracks) return;

    if (!shuffle) {
      const previousTracks = player.playlist.tracks.slice(
        0,
        player.current + 1,
      );
      let target = player.playlist.tracks.slice(player.current + 1);

      for (let i = 0; i < target.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [target[i], target[j]] = [target[j], target[i]];
      }

      const shuffled = [...previousTracks, ...target];
      setPlayer({
        ...player,
        playlist: {
          ...player.playlist,
          tracks: shuffled,
        },
      });

      setShuffle(true);
    } else {
      const currentTrack = originalPlaylist.tracks.indexOf(
        player.playlist.tracks[player.current],
      );

      const previousTracks = originalPlaylist.tracks.slice(0, currentTrack + 1);
      const unshuffled = [
        ...previousTracks,
        ...originalPlaylist.tracks.slice(currentTrack + 1),
      ];

      setPlayer({
        ...player,
        playlist: {
          ...player.playlist,
          tracks: unshuffled,
        },
      });

      setShuffle(false);
    }
  };

  const onLoadedMetadata = () => {
    setCurrentTime(audio.current?.currentTime);
    setDuration(audio.current?.duration);
    setLoaded(true);
  };

  const onTimeUpdate = () => setCurrentTime(audio.current?.currentTime);

  const onVolumeChange = () => {
    if (audio?.current) {
      setVolume(Math.round(audio.current.volume * 100));
    }
  };

  useEffect(() => {
    if (audio.current && typeof clickedTime === "number") {
      audio.current.currentTime = clickedTime;
    }
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    audio.current?.addEventListener("play", onPlay);
    audio.current?.addEventListener("pause", onPause);
    audio.current?.addEventListener("ended", onNext);
    audio.current?.addEventListener("timeupdate", onTimeUpdate);
    audio.current?.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.current?.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio.current?.removeEventListener("play", onPlay);
      audio.current?.removeEventListener("pause", onPause);
      audio.current?.removeEventListener("ended", onNext);
      audio.current?.removeEventListener("timeupdate", onTimeUpdate);
      audio.current?.removeEventListener("loadeddata", onLoadedMetadata);
      audio.current?.removeEventListener("volumechange", onVolumeChange);
    };
  }, [audio, src, clickedTime]);

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
    if (!player.playlist) return;

    if (player.playlist.id !== originalPlaylist?.id) {
      setOriginalPlaylist(player.playlist);
    }

    const fetchPlaylist = async () => {
      const response = await fetch(
        `/api/audio/${player.playlist?.tracks[player.current].yid}`,
      );
      const data = await response.json();
      setSrc(data.src);
    };

    fetchPlaylist();
  }, [player.playlist?.id, player.current]);

  useEffect(() => {
    if (loaded && player.userInteracted) {
      onPlay();
      setLoaded(false);
      setPlayer({ ...player, userInteracted: false });
    }
  }, [loaded, player.userInteracted]);

  const updatePlaylist = async (
    id: string,
    index: number = 0,
    userInteracted: boolean,
  ) => {
    const response = await fetch(`/api/playlists/${id}`);
    const data = await response.json();
    setPlayer({ playlist: data, current: index, userInteracted });
  };

  return {
    audio,
    playing,
    src,
    player,
    repeat,
    shuffle,
    currentTime,
    duration,
    clickedTime,
    volume,
    loaded,
    onPlay,
    onPause,
    onPrevious,
    onNext,
    onRepeat,
    onShuffle,
    setPlayer,
    setClickedTime,
    setVolume,
    updatePlaylist,
  };
};

const useAudioPlayer = () => useBetween(AudioPlayer);
export default useAudioPlayer;
