/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import React, { ChangeEvent, useEffect, useState } from "react";
import VolumeDown from "@material-ui/icons/VolumeDownRounded";
import VolumeMute from "@material-ui/icons/VolumeMuteRounded";
import { VolumeInput } from "./styles";

export default function Volume() {
  const { audio, volume } = useAudioPlayer();
  const [fallback, setFallback] = useState<number>(1);
  const [previousVolume, setPreviousVolume] = useState<number>(
    volume ?? fallback,
  );

  useEffect(() => {
    if (audio.current?.src && !volume) {
      audio.current.volume = fallback;
    }
  }, [audio.current?.src]);

  const onVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value) / 100;

    audio.current?.src
      ? (audio.current.volume = newVolume)
      : setFallback(newVolume);
  };

  const onVolumeBtnClick = () => {
    const oldVolume = volume ?? fallback;

    if ((volume && volume === 0) || fallback === 0) {
      audio.current?.src
        ? (audio.current.volume = parseInt(previousVolume.toString()) / 100)
        : setFallback(previousVolume * 100);
    } else {
      audio.current?.src ? (audio.current.volume = 0) : setFallback(0);
    }

    setPreviousVolume(oldVolume);
  };

  const onWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    const getNewVolume = (currentVolume: number) => {
      const delta = event.deltaY > 0 ? -5 : 5;
      const min = 0;
      const max = 100;
      const newValue = currentVolume * 100 + delta;
      const clampedValue = Math.min(Math.max(newValue, min), max);

      return parseFloat((clampedValue / 100).toFixed(2));
    };

    audio.current?.src
      ? (audio.current.volume = getNewVolume(audio.current.volume))
      : setFallback(getNewVolume(fallback));
  };

  return (
    <div className="volume" onWheel={onWheel}>
      <button
        type="button"
        className="volume__btn"
        aria-label={volume || fallback === 0 ? "Unmute" : "Mute"}
        onClick={onVolumeBtnClick}
      >
        {volume === 0 ? <VolumeMute /> : <VolumeDown />}
      </button>
      <VolumeInput
        type="range"
        min="0"
        max="100"
        value={typeof volume === "undefined" ? fallback * 100 : volume}
        onInput={onVolumeChange}
        percentage={typeof volume === "undefined" ? fallback * 100 : volume}
        aria-label="Volume Slider"
      />
    </div>
  );
}
