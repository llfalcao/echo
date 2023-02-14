import { RepeatOneRounded, RepeatRounded } from "@material-ui/icons";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Repeat() {
  const { repeat, onRepeat } = useAudioPlayer();

  return (
    <button
      className={`player__repeat ${
        repeat !== "none" ? "player__btn--active" : ""
      }`}
      aria-label={
        repeat === "none"
          ? "Enable Repeat"
          : repeat === "song"
          ? "Repeat Playlist"
          : "Disable Repeat"
      }
      onClick={onRepeat}
    >
      {repeat === "song" ? <RepeatOneRounded /> : <RepeatRounded />}
    </button>
  );
}
