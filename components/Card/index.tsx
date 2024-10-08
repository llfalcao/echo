"use client";

import Image from "next/image";
import Link from "next/link";

import { usePlayer, usePlayerDispatch } from "@/context/Player";
import Pause from "../Player/Pause";
import Play from "../Player/Play";

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
  const { playlist, current, playing } = usePlayer();
  const dispatch = usePlayerDispatch();
  const { id, cover_image: imageSrc, title } = data;

  const updatePlaylist = async (
    id: string,
    index: number,
    userInteracted: boolean,
  ) => {
    const response = await fetch(`/api/playlists/${id}`);
    const data: Playlist = await response.json();

    dispatch({
      type: "SET_PLAYLIST",
      payload: {
        playlist: data,
        current: data.tracks[index].id,
        userInteracted,
      },
    });
  };

  const handlePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (type === "playlist") {
      if (playlist?.id === data.id) {
        return dispatch({ type: "PLAY" });
      }

      updatePlaylist(data.id, index, true);
    }

    if (type === "track" && playlistId) {
      if (playlist?.id === playlistId && current === data.id) {
        return dispatch({ type: "PLAY" });
      }

      updatePlaylist(playlistId, index, true);
    }
  };

  const samePlaylist = type === "playlist" && playlist?.id === playlistId;
  const sameTrack =
    type === "track" && playlist?.id === playlistId && current === data.id;

  return (
    <li>
      <Link
        href={`/${type}/${id}`}
        className="card"
        aria-label={`${type}: ${title}`}
      >
        <Image
          src={imageSrc ?? `https://picsum.photos/135/135?sig=${id}`}
          alt="Cover Image"
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
      </Link>
    </li>
  );
}
