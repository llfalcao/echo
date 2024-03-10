import { usePlayer, usePlayerDispatch } from "@/context/Player";
import ShuffleRounded from "@material-ui/icons/ShuffleRounded";

export default function Shuffle() {
  const { shuffle } = usePlayer();
  const dispatch = usePlayerDispatch();

  return (
    <button
      className={`player__shuffle ${
        shuffle ? "player__btn--active" : ""
      }`.trim()}
      aria-label="Shuffle Playlist"
      onClick={() => dispatch({ type: "SHUFFLE" })}
      aria-pressed={shuffle}
    >
      <ShuffleRounded />
    </button>
  );
}
