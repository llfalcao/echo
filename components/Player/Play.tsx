"use client";

import PlayArrowRounded from "@material-ui/icons/PlayArrowRounded";
import { MouseEventHandler } from "react";

interface Props {
  classes?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Play({ classes, disabled, onClick }: Props) {
  return (
    <button
      className={classes ?? "player__btn"}
      aria-label="Play"
      disabled={disabled}
      onClick={onClick}
    >
      <PlayArrowRounded className="player__play" />
    </button>
  );
}
