"use client";

import { usePlayer, usePlayerDispatch } from "@/context/Player";
import Image from "next/image";
import { RefObject } from "react";
import Next from "./Next";
import Pause from "./Pause";
import Play from "./Play";
import Previous from "./Previous";
import ProgressBar from "./ProgressBar";
import Repeat from "./Repeat";
import Shuffle from "./Shuffle";
import Volume from "./Volume";

export default function Player() {
  const { audioRef, playlist, current, src, playing } = usePlayer();
  const { tracks } = playlist ?? {};
  const dispatch = usePlayerDispatch();
  const index = tracks?.findIndex((track) => track.id === current) ?? 0;
  const handlePlay = () => dispatch({ type: "PLAY" });

  return (
    <div className="player">
      <div className="song">
        {tracks?.length && (
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
        )}
      </div>
      <audio id="audio" ref={audioRef as RefObject<HTMLAudioElement>} />

      <div className="player__controls">
        <div className="player__btns">
          <Shuffle />
          <Previous />
          {playing ? <Pause /> : <Play disabled={!src} onClick={handlePlay} />}
          <Next />
          <Repeat />
        </div>
        <ProgressBar />
      </div>
      <Volume />
    </div>
  );
}
