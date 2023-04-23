import { SkipPreviousRounded } from "@material-ui/icons";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Previous() {
  const { onPrevious } = useAudioPlayer();

  return (
    <button
      className="player__previous"
      aria-label="Previous Song"
      onClick={onPrevious}
    >
      <SkipPreviousRounded />
    </button>
  );
}
