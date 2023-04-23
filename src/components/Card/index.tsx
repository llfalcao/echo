import Image from "next/image";

import useAudioPlayer from "@/hooks/useAudioPlayer";
import Play from "../Player/Play";
import Pause from "../Player/Pause";
import { getPlaceholder } from "@/utils/images";

interface Props {
  data: Playlist | Track;
  type: "playlist" | "track";
  imagePriority: boolean;
  playlistId?: string;
  index?: number;
}

export default function Card({
  data,
  type,
  imagePriority,
  playlistId,
  index = 0,
}: Props) {
  const { player, playing, loaded, onPlay, updatePlaylist, setPlayer } =
    useAudioPlayer();
  const { id, cover_image: imageSrc, title } = data;

  const handlePlay = () => {
    if (type === "playlist") {
      if (player.playlist?.id === data.id) {
        return onPlay();
      }

      updatePlaylist(data.id, undefined, true);
    }

    if (type === "track" && playlistId) {
      if (
        player.playlist?.id === playlistId &&
        player.playlist?.tracks[player.current].id === data.id
      ) {
        return onPlay();
      }

      updatePlaylist(playlistId, index, true);
    }
  };

  return (
    <li className="card">
      <Image
        src={imageSrc ?? `https://picsum.photos/135/135?sig=${id}`}
        alt={title}
        className={`card__image ${
          !imageSrc ? "card__image--loading" : ""
        }`.trim()}
        width="150"
        height="150"
        loading={imagePriority ? "eager" : "lazy"}
        quality={100}
        priority={imagePriority}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${getPlaceholder(150, 150)}`}
      />
      <p className="card__title">{title || ""}</p>
      {playing &&
      ((type === "playlist" && player.playlist?.id === data?.id) ||
        (type === "track" &&
          player.playlist?.id === playlistId &&
          player.playlist?.tracks.some((track) => track.id === data.id))) ? (
        <Pause classes="card__pauseBtn" />
      ) : (
        <Play classes="card__playBtn" onClick={handlePlay} />
      )}
    </li>
  );
}
