import SkipNextRounded from "@material-ui/icons/SkipNextRounded";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Next() {
  const { onNext } = useAudioPlayer();

  return (
    <button className="player__next" aria-label="Next Song" onClick={onNext}>
      <SkipNextRounded />
    </button>
  );
}
