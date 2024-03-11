"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { playerReducer } from "./reducer";

export interface Player {
  playlist?: Playlist;
  backupPlaylist?: Playlist;
  current?: TrackId;
  src: string;
  playing: boolean;
  repeat: "none" | "song" | "playlist";
  shuffle: boolean;
  currentTime?: number;
  duration?: number;
  clickedTime?: number;
  volume?: number;
  audioRef: RefObject<HTMLAudioElement | null>;
  userInteracted: boolean;
}

export interface PlayerAction {
  type:
    | "PLAY"
    | "PAUSE"
    | "PREVIOUS"
    | "NEXT"
    | "REPEAT"
    | "SHUFFLE"
    | "SET_PLAYLIST"
    | "SET_BACKUP_PLAYLIST"
    | "SET_SRC"
    | "SET_CURRENT"
    | "SET_TRACKS"
    | "SET_CURRENT_TIME"
    | "SET_DURATION"
    | "SET_CLICKED_TIME"
    | "SET_VOLUME"
    | "USER_INTERACTION";
  payload?: any;
}

const initialState: Player = {
  playlist: undefined,
  backupPlaylist: undefined,
  current: undefined,
  src: "",
  playing: false,
  repeat: "none",
  shuffle: false,
  currentTime: 0,
  duration: 0,
  clickedTime: undefined,
  audioRef: {} as RefObject<HTMLAudioElement>,
  userInteracted: false,
};

const PlayerContext = createContext<Player>(initialState);
const PlayerDispatchContext = createContext<Dispatch<PlayerAction>>(() => {});

interface Props {
  children: Readonly<ReactNode>;
}

const PlayerContextProvider = ({ children }: Props) => {
  const [player, dispatch] = useReducer(playerReducer, {
    ...initialState,
    audioRef: useRef<HTMLAudioElement | null>(null),
  });

  const {
    audioRef,
    playing,
    repeat,
    src,
    clickedTime,
    playlist,
    backupPlaylist,
    current,
    userInteracted,
  } = player;

  const audio = audioRef.current;

  const getCurrentTrackIndex = (tracks: Track[], trackId: string) => {
    return tracks?.findIndex((track) => track.id === trackId) ?? 0;
  };

  useEffect(() => {
    playing ? audio?.play() : audio?.pause();
  }, [audio, playing]);

  const onTimeUpdate = () => {
    dispatch({ type: "SET_CURRENT_TIME", payload: audio?.currentTime });
  };

  const onVolumeChange = () => {
    if (!audio) return;
    const newVolume = Math.round(audio.volume * 100);
    dispatch({ type: "SET_VOLUME", payload: newVolume });
  };

  // Handle updates on the "Repeat" button
  useEffect(() => {
    if (!audio) return;
    audio.loop = repeat !== "none";
  }, [audio, repeat]);

  const onPlay = () => dispatch({ type: "PLAY" });
  const onPause = () => dispatch({ type: "PAUSE" });
  const onPrevious = () => dispatch({ type: "PREVIOUS" });
  const onNext = () => dispatch({ type: "NEXT" });

  useEffect(() => {
    if (audio && typeof clickedTime === "number") {
      audio.currentTime = clickedTime;
    }

    audio?.addEventListener("play", onPlay);
    audio?.addEventListener("pause", onPause);
    audio?.addEventListener("ended", onNext);
    audio?.addEventListener("timeupdate", onTimeUpdate);
    audio?.addEventListener("volumechange", onVolumeChange);

    return () => {
      audio?.removeEventListener("play", onPlay);
      audio?.removeEventListener("pause", onPause);
      audio?.removeEventListener("ended", onNext);
      audio?.removeEventListener("timeupdate", onTimeUpdate);
      audio?.removeEventListener("volumechange", onVolumeChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, src, clickedTime]);

  // Handle media keys
  useEffect(() => {
    navigator.mediaSession.setActionHandler("play", onPlay);
    navigator.mediaSession.setActionHandler("pause", onPause);
    navigator.mediaSession.setActionHandler("previoustrack", onPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", onNext);
  }, []);

  useEffect(() => {
    const updateBackground = () => {
      const { backgroundImage: bg } = getComputedStyle(document.body);
      const url = bg.slice(5, -2);
      const { tracks } = playlist ?? {};
      if (!tracks?.length || !current) return;
      const index = getCurrentTrackIndex(tracks, current);

      // Preload next image
      const image = new Image();
      image.src = tracks[index].cover_image ?? url;

      const onImageLoad = () => {
        document.body.style.backgroundImage = bg.replace(url, image.src);
        image.removeEventListener("load", onImageLoad);
      };

      image.addEventListener("load", onImageLoad);
    };

    if (typeof window !== "undefined" && audio) {
      audio.src = src;
      audio.load();

      if (playing) {
        audio.play();
      }

      updateBackground();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (!playlist) return;
    if (playlist.id !== backupPlaylist?.id) {
      dispatch({ type: "SET_BACKUP_PLAYLIST", payload: playlist });
    }

    const fetchTrack = async () => {
      const index = getCurrentTrackIndex(playlist?.tracks ?? [], current ?? ""); // fix this
      const response = await fetch(`/api/audio/${playlist?.tracks[index].yid}`);

      if (!response.ok) {
        return onNext();
      }

      const data = await response.json();
      dispatch({ type: "SET_SRC", payload: data.src });
    };

    fetchTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.id, current]);

  useEffect(() => {
    const onLoadedMetadata = () => {
      dispatch({ type: "SET_CURRENT_TIME", payload: audio?.currentTime });
      dispatch({ type: "SET_DURATION", payload: audio?.duration });
      if (userInteracted) {
        dispatch({ type: "PLAY" });
        dispatch({ type: "USER_INTERACTION", payload: false });
      }
    };

    audio?.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio?.removeEventListener("loadeddata", onLoadedMetadata);
    };
  }, [audio, userInteracted]);

  return (
    <PlayerContext.Provider value={player}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
export const usePlayerDispatch = () => useContext(PlayerDispatchContext);
export default PlayerContextProvider;
