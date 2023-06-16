"use client";

import useSWR, { Fetcher } from "swr";

export const usePlaylists = (ids: string[]) => {
  const fetcher: Fetcher<Playlist[]> = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/playlists?id=${ids.join("&id=")}`,
    fetcher,
  );

  return {
    playlists: data,
    error,
    isLoading,
  };
};
