import { PlayArrowRounded } from "@material-ui/icons";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Play() {
  const { src, onPlay } = useAudioPlayer();

  return (
    <button
      className="player__btn"
      aria-label="Play"
      disabled={!src}
      onClick={onPlay}
    >
      <PlayArrowRounded className="player__play" />
    </button>
  );
}
