"use client";

import { usePlayerDispatch } from "@/context/Player";
import PauseBtn from "@mui/icons-material/Pause";

interface Props {
  classes?: string;
}

export default function Pause({ classes = "player__btn" }: Props) {
  const dispatch = usePlayerDispatch();

  return (
    <button
      className={classes}
      aria-label="Pause"
      onClick={() => dispatch({ type: "PAUSE" })}
    >
      <PauseBtn className="player__pause" />
    </button>
  );
}
