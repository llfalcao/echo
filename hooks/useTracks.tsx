"use client";

import useSWR, { Fetcher } from "swr";

const useTracks = (id: string) => {
  const fetcher: Fetcher<Track> = async (url: string) => {
    const response = await fetch(url);
    return await response.json();
  };

  const { data, error, isLoading } = useSWR(`/api/tracks/${id}`, fetcher);

  return {
    track: data,
    error,
    isLoading,
  };
};

export default useTracks;
