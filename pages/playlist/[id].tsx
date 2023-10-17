import { usePlaylists } from "@/hooks/usePlaylists";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const Playlist: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { playlists, isLoading, error } = usePlaylists([id as string]);

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

  return (
    <div>
      <div>
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
      <ul>
        {tracks?.map((track) => (
          <li key={track.id}>{track.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
