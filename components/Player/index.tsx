/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import Image from "next/image";

import Shuffle from "./Shuffle";
import Previous from "./Previous";
import Play from "./Play";
import Pause from "./Pause";
import Next from "./Next";
import Repeat from "./Repeat";
import ProgressBar from "./ProgressBar";
import Volume from "./Volume";

export default function Player() {
  const { audio, src, playing, player, onPlay } = useAudioPlayer();
  const { playlist, current } = player;
  const { tracks } = playlist ?? {};
  const index = tracks?.findIndex((track) => track.id === current) ?? 0;

  return (
    <div className="player">
      <div className="song">
        {tracks?.length ? (
          <>
            <Image
              className="song__cover"
              src={tracks[index].cover_image ?? ""}
              alt="Song Cover Image"
              width={64}
              height={64}
            />
            <div>
              <p className="song__title">{tracks[index].title ?? ""}</p>
              <p className="song__artist">Unknown Artist</p>
            </div>
          </>
        ) : null}
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
