import RepeatOneRounded from "@material-ui/icons/RepeatOneRounded";
import RepeatRounded from "@material-ui/icons/RepeatRounded";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function Repeat() {
  const { repeat, onRepeat } = useAudioPlayer();

  return (
    <button
      className={`player__repeat ${
        repeat !== "none" ? "player__btn--active" : ""
      }`.trim()}
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
