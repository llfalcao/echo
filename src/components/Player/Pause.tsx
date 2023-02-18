import { Pause as PauseBtn } from "@material-ui/icons";

import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Pause() {
  const { onPause } = useAudioPlayer();

  return (
    <button className="player__btn" aria-label="Pause" onClick={onPause}>
      <PauseBtn className="player__pause" />
    </button>
  );
}
