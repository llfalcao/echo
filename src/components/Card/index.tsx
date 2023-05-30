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
  const {
    player: { playlist, current },
    playing,
    onPlay,
    updatePlaylist,
  } = useAudioPlayer();

  const { id, cover_image: imageSrc, title } = data;

  const handlePlay = () => {
    if (type === "playlist") {
      if (playlist?.id === data.id) {
        return onPlay();
      }

      updatePlaylist(data.id, 0, true);
    }

    if (type === "track" && playlistId) {
      if (
        playlist?.id === playlistId &&
        playlist?.tracks[current].id === data.id
      ) {
        return onPlay();
      }

      updatePlaylist(playlistId, index, true);
    }
  };

  const samePlaylist = type === "playlist" && playlist?.id === playlistId;
  const sameTrack =
    type === "track" &&
    playlist?.id === playlistId &&
    playlist?.tracks[current].id === data.id;

  return (
    <li className="card">
      <Image
        src={imageSrc ?? `https://picsum.photos/135/135?sig=${id}`}
        alt={title}
        className="card__image card__image--loading"
        width="150"
        height="150"
        loading={imagePriority ? "eager" : "lazy"}
        quality={100}
        priority={imagePriority}
        onLoad={({ currentTarget }) =>
          currentTarget.classList.remove("card__image--loading")
        }
      />
      <p className="card__title">{title || ""}</p>

      {playing && (samePlaylist || sameTrack) ? (
        <Pause classes="card__pauseBtn" />
      ) : (
        <Play classes="card__playBtn" onClick={handlePlay} />
      )}
    </li>
  );
}
