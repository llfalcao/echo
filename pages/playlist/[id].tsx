import Pause from "@/components/Player/Pause";
import Play from "@/components/Player/Play";
import { usePlayer, usePlayerDispatch } from "@/context/Player";
import { usePlaylists } from "@/hooks/usePlaylists";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Playlist: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { playlists, isLoading, error } = usePlaylists([id as string]);
  const { current, playing } = usePlayer();
  const dispatch = usePlayerDispatch();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <h1>Something went very wrong.</h1>;
  }

  if (!playlists?.length) {
    return <h1>Playlist not found.</h1>;
  }

  const [playlist] = playlists;
  const { title, tracks, cover_image, created_at, updated_at } = playlist;

  const COVER_SIZE = 200;
  const cover =
    cover_image ?? `https://picsum.photos/${COVER_SIZE}/${COVER_SIZE}.webp`;

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

  const handlePlay = (index: number) => {
    updatePlaylist(id, index, true);
  };

  return (
    <div>
      <div className="playlist__header">
        <Image
          src={cover}
          alt={title}
          width={COVER_SIZE}
          height={COVER_SIZE}
          loading="eager"
          quality={100}
          priority
        />
        <h1>
          {title} #{id}
        </h1>
      </div>
      <ul className="playlist__tracks">
        {tracks?.map((track, index) => {
          const isCurrent = playlist?.id === id && current === track.id;

          return (
            <li
              key={track.id}
              className={`playlist__track ${
                current === track.id ? "playlist__track--active" : ""
              }`.trim()}
            >
              {playing && isCurrent ? (
                <Pause classes="playlist__pauseBtn" />
              ) : (
                <Play
                  classes="playlist__playBtn"
                  onClick={() => handlePlay(index)}
                />
              )}
              <Link href={`/track/${track.id}`}>
                <Image
                  src={
                    track.cover_image ?? `https://picsum.photos/32/32?sig=${id}`
                  }
                  alt="Cover Image"
                  className="playlist__trackImage playlist'__trackImage--loading"
                  width="32"
                  height="32"
                  loading="eager"
                  quality={100}
                  onLoad={({ currentTarget }) =>
                    currentTarget.classList.remove(
                      "playlist__trackImage--loading",
                    )
                  }
                />
                <span className="playlist__trackTitle">{track.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
