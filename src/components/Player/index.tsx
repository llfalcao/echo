/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";

export default function Player() {
  const {
    audio,
    src,
    playing,
    setPlaylist,
    onPlay,
    onPause,
    onPrevious,
    onNext,
    onRepeat,
  } = useAudioPlayer();

  useEffect(() => {
    fetch("/api/playlists/1")
      .then((res) => res.json())
      .then((data) => setPlaylist(data));
  }, []);

  return (
    <div>
      <audio id="audio" ref={audio} controls />
      {playing ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onPlay} disabled={src.length === 0}>
          Play
        </button>
      )}
      <button onClick={onPrevious}>Previous</button>
      <button onClick={() => onNext()}>Next</button>
      <button onClick={onRepeat}>Repeat</button>
    </div>
  );
}
