"use client";

import { usePlayerDispatch } from "@/context/Player";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";

export default function Previous() {
  const dispatch = usePlayerDispatch();

  return (
    <button
      className="player__previous"
      aria-label="Previous Song"
      onClick={() => dispatch({ type: "PREVIOUS" })}
    >
      <SkipPreviousRounded />
    </button>
  );
}
