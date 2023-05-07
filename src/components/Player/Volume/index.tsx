/* eslint-disable react-hooks/exhaustive-deps */
import useAudioPlayer from "@/hooks/useAudioPlayer";
import React, { ChangeEvent, useEffect, useState } from "react";
import VolumeDown from "@material-ui/icons/VolumeDownRounded";
import VolumeMute from "@material-ui/icons/VolumeMuteRounded";
import { VolumeInput } from "./styles";

export default function Volume() {
  const { audio, volume } = useAudioPlayer();
  const [fallback, setFallback] = useState<string>("100");
  const [previousVolume, setPreviousVolume] = useState<number | string>(
    volume ?? fallback,
  );

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

  const onVolumeBtnClick = () => {
    const oldVolume = volume ?? fallback;

    if (volume === 0 || (!volume && fallback === "0")) {
      if (audio.current?.src) {
        audio.current.volume = parseInt(previousVolume.toString()) / 100;
      } else {
        const newFallback =
          typeof previousVolume === "string"
            ? previousVolume
            : (previousVolume * 100).toString();
        setFallback(newFallback);
      }
    } else {
      if (audio.current?.src) {
        audio.current.volume = 0;
      } else {
        setFallback("0");
      }
    }

    setPreviousVolume(oldVolume);
  };

  return (
    <div className="volume">
      <button
        type="button"
        className="volume__btn"
        aria-label={volume === 0 ? "Unmute" : "Mute"}
        onClick={onVolumeBtnClick}
      >
        {volume === 0 ? <VolumeMute /> : <VolumeDown />}
      </button>
      <VolumeInput
        type="range"
        min="0"
        max="100"
        value={volume ?? fallback}
        onInput={onVolumeChange}
        percentage={volume ?? fallback}
        aria-label="Volume Slider"
      />
    </div>
  );
}
