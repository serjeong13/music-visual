import useSWR from "swr";
import { useSession } from "next-auth/react";
import PlaylistItem from "../PlaylistItem/index.js";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  }).then((res) => res.json());

const PlaylistsContainer = () => {
  const { session } = useSession();

  //SWR fetch
  const { data, error } = useSWR(
    session?.accessToken
      ? [`https://api.spotify.com/v1/me/playlists`, session.accessToken]
      : null,
    fetcher
  );
  if (error) return <div>Failed to load playlists</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.items.map((playlist) => (
        <PlaylistItem key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistsContainer;
