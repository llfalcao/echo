import Image from "next/image";

import useAudioPlayer from "@/hooks/useAudioPlayer";
import { Playlist } from "@/typings/AudioPlayer";
import Play from "../Player/Play";
import Pause from "../Player/Pause";

interface Props {
  data: Playlist;
}

export default function Card({ data }: Props) {
  const { playlist, setPlaylist, playing } = useAudioPlayer();

  const handlePlay = () => setPlaylist(data);

  return (
    <li className="card">
      <Image
        src={data.image ?? ""}
        alt={data.title}
        className={`card__image ${
          !data.image ? "card__image--loading" : ""
        }`.trim()}
        width="135"
        height="135"
        loading="lazy"
        quality={100}
      />
      <p className="card__title">{data.title || ""}</p>
      {data.id === playlist?.id && playing ? (
        <Pause classes="card__pauseBtn" />
      ) : (
        <Play classes="card__playBtn" onClick={handlePlay} disabled={false} />
      )}
    </li>
  );
}
