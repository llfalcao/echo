/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useBetween } from "use-between";

interface Player {
  playlist?: Playlist;
  current?: TrackId;
  userInteracted: boolean;
}

const AudioPlayer = () => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [player, setPlayer] = useState<Player>({
    playlist: undefined,
    current: undefined,
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

  const getCurrentTrackIndex = () =>
    player.playlist?.tracks.findIndex((track) => track.id === player.current) ??
    0;

  const onPlay = () => {
    setPlaying(true);
    audio.current?.play();
  };

  const onPause = () => {
    setPlaying(false);
    audio.current?.pause();
  };

  const onPrevious = () => {
    const current = getCurrentTrackIndex();
    const { tracks } = player.playlist ?? {};

    if (current && tracks?.[current - 1]) {
      setPlayer({ ...player, current: tracks[current - 1].id });
    }
  };

  const onNext = () => {
    const current = getCurrentTrackIndex();
    const { tracks } = player.playlist ?? {};

    if (!tracks?.length || !audio.current) return;
    const hasNext = tracks[current + 1] !== undefined;
    const isLast = tracks[tracks.length - 1].id === tracks[current].id;

    if (repeat === "song") {
      audio.current.currentTime = 0;
    } else if (repeat === "playlist" && isLast) {
      setPlayer({ ...player, current: tracks[0].id });
    } else if (hasNext) {
      setPlayer({ ...player, current: tracks[current + 1].id });
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
    const current = getCurrentTrackIndex();
    const { tracks } = player.playlist ?? {};
    if (!tracks || !player.playlist || !originalPlaylist?.tracks) return;

    // Currently NOT shuffled
    if (!shuffle) {
      const [previousTracks, target] = tracks.reduce(
        (acc, track, index) => {
          if (index <= current) {
            acc[0].push(track);
          } else {
            acc[1].push(track);
          }
          return acc;
        },
        [[], []] as [Track[], Track[]],
      );

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
      const currentTrackIndex = originalPlaylist.tracks.findIndex(
        (track) => track.id === tracks[current].id,
      );

      const upToCurrent = originalPlaylist.tracks.slice(
        0,
        currentTrackIndex + 1,
      );

      const [before, after] = originalPlaylist.tracks.reduce(
        (acc, track, index) => {
          if (index <= currentTrackIndex) {
            acc[0].push(track);
          } else {
            acc[1].push(track);
          }
          return acc;
        },
        [[], []] as [Track[], Track[]],
      );

      const unshuffled = [...before, ...after];

      setPlayer({
        ...player,
        playlist: {
          ...player.playlist,
          tracks: unshuffled,
        },
        current: originalPlaylist.tracks[currentTrackIndex].id,
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

  const updateBackground = () => {
    const { backgroundImage } = getComputedStyle(document.body);
    const urlStart = backgroundImage.indexOf('("') + 2;
    const urlEnd = backgroundImage.indexOf('")');
    const currentUrl = backgroundImage.substring(urlStart, urlEnd);
    const { playlist } = player ?? {};
    const { tracks } = playlist ?? {};
    const currentTrackIndex = getCurrentTrackIndex();

    if (!tracks?.length) return;

    // Preload next image
    const image = new Image();
    image.src = tracks[currentTrackIndex].cover_image ?? currentUrl;

    const onImageLoad = () => {
      document.body.style.backgroundImage = backgroundImage.replace(
        currentUrl,
        image.src,
      );

      image.removeEventListener("load", onImageLoad);
    };

    image.addEventListener("load", onImageLoad);
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

      updateBackground();
    }
  }, [src]);

  useEffect(() => {
    const current = getCurrentTrackIndex();
    if (!player.playlist) return;

    if (player.playlist.id !== originalPlaylist?.id) {
      setOriginalPlaylist(player.playlist);
    }

    const fetchPlaylist = async () => {
      const response = await fetch(
        `/api/audio/${player.playlist?.tracks[current].yid}`,
      );

      if (!response.ok) {
        return onNext();
      }

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
    index: number,
    userInteracted: boolean,
  ) => {
    const response = await fetch(`/api/playlists/${id}`);
    const data: Playlist = await response.json();

    setPlayer({
      playlist: data,
      current: data.tracks[index].id,
      userInteracted,
    });
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
