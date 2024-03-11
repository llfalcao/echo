import { getTrack } from "@/app/api/tracks";
import Favorite from "@mui/icons-material/FavoriteRounded";
import Forum from "@mui/icons-material/ForumRounded";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  params: {
    id: string;
  };
}

export default async function Track({ params }: Props) {
  const { id } = params;
  const track = await getTrack(id);

  if (!track) return null;

  return (
    <div className="track">
      <div className="track__header">
        <Image
          className="track__image"
          src={track.cover_image}
          alt={track.title}
          width={150}
          height={150}
          loading="eager"
          quality={100}
          // onLoad={({ currentTarget }) =>
          //   currentTarget.classList.remove("track__image--loading")
          // }
        />
        <div className="track__info">
          <h1 className="track__title">{track.title}</h1>
          <div className="track__stats">
            <div className="track__stat">
              <Favorite />
              <span>0</span>
            </div>
            <div className="track__stat">
              <span style={{ fontSize: "26px" }}>#</span>
              <span>0</span>
            </div>
            <div className="track__stat">
              <Forum />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      <p className="track__description">
        Lorem ipsum dolor sit amet consectetur. Diam imperdiet pretium elementum
        diam proin et ullamcorper eleifend ullamcorper. Integer ut ultrices nunc
        ac tincidunt commodo. Dictum odio velit purus lacinia nam velit est
        dolor. Augue condimentum eget ipsum aliquam malesuada tortor lectus
        lorem. Viverra placerat pretium dolor tortor id egestas pharetra
        adipiscing non. Etiam arcu non adipiscing dolor et.
      </p>

      <div className="track__lyrics">
        <h2>Interpreted Lyrics</h2>
        <pre>{track.lyrics || "Unavailable"}</pre>
      </div>

      <div className="track__comments">
        <h2>Comments</h2>
        <ul className={`comments ${inter.className}`}>
          <li className="comment">
            <div className="comment__header">
              <span className="comment__author">lenz</span>
              <span className="comment__time">8 hours ago</span>
            </div>
            <p className="comment__body">
              Lorem ipsum dolor sit amet consectetur. Quam feugiat scelerisque
              ut risus turpis odio. Suscipit consectetur nisl est nunc nisi
              augue bibendum eget vivamus. Non iaculis ornare eget in malesuada.
              Urna molestie ornare mauris a id dui. Rhoncus egestas nisl eu
              augue. Ultrices massa enim egestas mattis facilisis suscipit enim.
              Ut tristique scelerisque dolor mus.
            </p>
          </li>
          <li className="comment">
            <div className="comment__header">
              <span className="comment__author">llfalcao</span>
              <span className="comment__time">4 hours ago</span>
            </div>
            <p className="comment__body">
              Lorem ipsum dolor sit amet consectetur. Quam feugiat scelerisque
              ut risus turpis odio. Suscipit consectetur nisl est nunc nisi
              augue bibendum eget vivamus. Non iaculis ornare eget in malesuada.
              Urna molestie ornare mauris a id dui. Rhoncus egestas nisl eu
              augue. Ultrices massa enim egestas mattis facilisis suscipit enim.
              Ut tristique scelerisque dolor mus.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
