import Image from "next/image";

import useAudioPlayer from "@/hooks/useAudioPlayer";
import Play from "../Player/Play";
import Pause from "../Player/Pause";

interface Props {
  data: Playlist;
  imagePriority?: boolean;
}

export default function Card({ data, imagePriority }: Props) {
  const { playlist, setPlaylist, playing } = useAudioPlayer();

  const handlePlay = () => setPlaylist(data);

  return (
    <li className="card">
      <Image
        src={data.cover_image ?? ""}
        alt={data.title}
        className={`card__image ${
          !data.cover_image ? "card__image--loading" : ""
        }`.trim()}
        width="135"
        height="135"
        loading={imagePriority ? undefined : "lazy"}
        quality={100}
        priority={imagePriority}
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
