import useAudioPlayer from "@/hooks/useAudioPlayer";
import React, { ChangeEvent } from "react";

export default function Volume() {
  const { audio, volume } = useAudioPlayer();

  const onVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (audio.current) {
      audio.current.volume = parseInt(event.target.value) / 100;
    }
  };

  return (
    <input
      className="volume"
      type="range"
      min="0"
      max="100"
      value={volume}
      onInput={onVolumeChange}
      style={{
        background: `linear-gradient(to right, #5555df ${volume}%, #fff ${volume}%)`,
      }}
    />
  );
}
