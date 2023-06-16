import clientPromise from "@/utils/db";
import Track from ".";
import { redirect, useParams, usePathname } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

const getTrack = async (id: string) => {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db
      .collection("tracks")
      .findOne<Track>({ id }, { projection: { _id: 0 } });

    if (!data) {
      return null;
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = params;
  const track = await getTrack(id);

  return {
    title: track?.title ?? "re:tune",
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const { id } = params;
  const track = await getTrack(id);

  if (!track) {
    redirect("/");
  }

  return <Track track={track} />;
};

export default Page;
