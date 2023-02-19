import { Playlist } from "@/typings/AudioPlayer";
import { useEffect, useState } from "react";
import Card from "../Card";

interface Props {
  title?: string;
  content: {
    type: "playlist";
    ids: string[];
  };
}

export default function Featured({ title, content }: Props) {
  const [data, setData] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const promises = content.ids.map(async (id) => {
          const res = await fetch(`/api/playlists/${id}`);
          return await res.json();
        });

        const playlists = await Promise.all(promises);
        setData(playlists);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylists();
  }, [content.ids]);

  return (
    <div className="featured">
      {title && <h2 className="featured__title">Trending</h2>}
      <ul className="featured__cards">
        {data.map((item) => (
          <Card key={item.id} data={item} />
        ))}
      </ul>
    </div>
  );
}
