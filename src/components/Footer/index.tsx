/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";

export default function Footer() {
  const { src, playing, setPlaylist, onPause, onPlay } = useAudioPlayer();

  useEffect(() => {
    fetch("/api/playlists/1")
      .then((res) => res.json())
      .then((data) => setPlaylist(data));
  }, []);

  return (
    <div>
      {playing ? (
        <button onClick={onPause}>Pause</button>
      ) : (
        <button onClick={onPlay} disabled={src.length === 0}>
          Play
        </button>
      )}
    </div>
  );
}
