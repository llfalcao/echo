/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import React, { ChangeEvent, useEffect, useState } from "react";

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
    <input
      className="volume"
      type="range"
      min="0"
      max="100"
      value={volume ?? fallback}
      onInput={onVolumeChange}
      style={{
        background: `linear-gradient(to right, #5555df ${
          volume ?? fallback
        }%, #fff ${volume ?? fallback}%)`,
      }}
    />
  );
}
