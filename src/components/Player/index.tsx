/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";

import Shuffle from "./Shuffle";
import Previous from "./Previous";
import Play from "./Play";
import Pause from "./Pause";
import Next from "./Next";
import Repeat from "./Repeat";
import ProgressBar from "./ProgressBar";
import Volume from "./Volume";

export default function Player() {
  const { audio, src, playing, player, setPlayer, onPlay } = useAudioPlayer();

  useEffect(() => {
    // TODO: load the last played playlist
  }, []);

  const testPlaylist = (id: number) => {
    fetch(`/api/playlists/${id}`)
      .then((res) => res.json())
      .then((data) => setPlayer({ ...player, playlist: data }));
  };

  return (
    <div className="player">
      <div className="song">
        <button onClick={() => testPlaylist(1)}>start 1</button>
        <button onClick={() => testPlaylist(2)}>start 2</button>
      </div>
      <audio id="audio" ref={audio} />

      <div className="player__controls">
        <div className="player__btns">
          <Shuffle />
          <Previous />
          {playing ? <Pause /> : <Play disabled={!src} onClick={onPlay} />}
          <Next />
          <Repeat />
        </div>
        <ProgressBar />
      </div>
      <Volume />
    </div>
  );
}
