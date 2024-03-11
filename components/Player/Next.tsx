"use client";

import { usePlayerDispatch } from "@/context/Player";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";

export default function Next() {
  const dispatch = usePlayerDispatch();

  return (
    <button
      className="player__next"
      aria-label="Next Song"
      onClick={() => dispatch({ type: "NEXT" })}
    >
      <SkipNextRounded />
    </button>
  );
}
