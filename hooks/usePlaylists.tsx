import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<Playlist[]> = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

export const usePlaylists = (ids: string[]) => {
  const { data, error, isLoading } = useSWR(
    `/api/playlists?ids=${ids.join(",")}`,
    fetcher,
  );

  return {
    playlists: data,
    error,
    isLoading,
  };
};
