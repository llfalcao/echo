/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import React, { ChangeEvent, useEffect, useState } from "react";
import { VolumeInput } from "./styles";

export default function Volume() {
  const { audio, volume } = useAudioPlayer();
  const [fallback, setFallback] = useState<string>("100");

  useEffect(() => {
    if (audio.current?.src && !volume) {
      audio.current.volume = parseInt(fallback) / 100;
    }
  }, [audio.current?.src]);

  const onVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value) / 100;

    if (audio.current?.src) {
      audio.current.volume = newVolume;
    } else {
      setFallback(event.target.value);
    }
  };

  return (
    <div className="volume">
      <VolumeInput
        type="range"
        min="0"
        max="100"
        value={volume ?? fallback}
        onInput={onVolumeChange}
        percentage={volume ?? fallback}
      />
    </div>
  );
}
