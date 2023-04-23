import { useEffect, useState } from "react";
import Card from "../Card";

interface Props {
  title?: string;
  content: {
    type: "playlist" | "track";
    ids: string[];
  };
  imagePriority?: boolean;
}

export default function Featured({
  title,
  content,
  imagePriority = false,
}: Props) {
  const [data, setData] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = content.ids.map(async (id) => {
          const minimal = content.type === "playlist" ? "?minimal=true" : "";
          const res = await fetch(`/api/playlists/${id}${minimal}`);
          return await res.json();
        });

        const playlists = await Promise.all(promises);
        setData(playlists);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [content.type, content.ids]);

  if (!data.length) return null;

  return (
    <div className="featured">
      {title && <h2 className="featured__title">{title}</h2>}
      <ul className="featured__cards">
        {content.type === "playlist"
          ? data.map((item) => (
              <Card
                key={item.id}
                data={item}
                type={content.type}
                imagePriority={imagePriority}
              />
            ))
          : data[0].tracks.map((item, index) => (
              <Card
                key={item.id}
                playlistId={data[0].id}
                index={index}
                data={item}
                type={content.type}
                imagePriority={imagePriority}
              />
            ))}
      </ul>
    </div>
  );
}
