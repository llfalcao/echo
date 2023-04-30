import PauseBtn from "@material-ui/icons/Pause";
import useAudioPlayer from "@/hooks/useAudioPlayer";

interface Props {
  classes?: string;
}

export default function Pause({ classes = "player__btn" }: Props) {
  const { onPause } = useAudioPlayer();

  return (
    <button className={classes} aria-label="Pause" onClick={onPause}>
      <PauseBtn className="player__pause" />
    </button>
  );
}
