"use client";

import { usePlayer, usePlayerDispatch } from "@/context/Player";
import RepeatOneRounded from "@mui/icons-material/RepeatOneRounded";
import RepeatRounded from "@mui/icons-material/RepeatRounded";

export default function Repeat() {
  const { repeat } = usePlayer();
  const dispatch = usePlayerDispatch();

  return (
    <button
      className={`player__repeat ${
        repeat !== "none" ? "player__btn--active" : ""
      }`.trim()}
      aria-label={
        repeat === "none"
          ? "Repeat: Disabled"
          : repeat === "song"
            ? "Repeat: Song"
            : "Repeat: Playlist"
      }
      onClick={() => dispatch({ type: "REPEAT" })}
    >
      {repeat === "song" ? <RepeatOneRounded /> : <RepeatRounded />}
    </button>
  );
}
