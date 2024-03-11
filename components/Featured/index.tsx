import { FeaturedContent } from "@/app/page";
import Card from "../Card";

export default function Featured({
  title,
  content,
  imagePriority = false,
}: FeaturedContent) {
  return (
    <div className="featured">
      {title && <h2 className="featured__title">{title}</h2>}
      <ul className="featured__cards">
        {content.type === "playlist"
          ? content.data.map((item) => (
              <Card
                key={item.id}
                data={item}
                type={content.type}
                imagePriority={imagePriority}
              />
            ))
          : content.data[0]?.tracks.map((item, index) => (
              <Card
                key={item.id}
                playlistId={content.data[0].id}
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
