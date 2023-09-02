import { useContext, useEffect } from "react";
import useSWR from "swr";
import { useSession } from "../contexts/SessionContext";
import { usePlaylist } from "../contexts/PlaylistContext";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  }).then((res) => res.json());

export function useSpotifyPlaylists() {
  const { session } = useSession();
  const { setPlaylist } = usePlaylist();

  const { data, error } = useSWR(
    session
      ? [`https://api.spotify.com/v1/me/playlists`, session.accessToken]
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setPlaylist(data.items);
    }
  }, [data]);

  return {
    playlists: data?.items,
    isLoading: !data && !error,
    isError: error,
  };
}
