import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "../../contexts/SessionContext";

const fetcher = (url, session) => {
  console.log("Token Object:", session?.token);
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.token?.accessToken}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .catch((error) => {
      console.log("Fetch error:", error);
    });
};

export default function PlaylistPage() {
  const { session } = useSession();
  const router = useRouter();
  console.log("Router query:", router.query);
  const { playlistId } = router.query;

  // Fetch playlist details using SWR
  const { data, error } = useSWR(
    playlistId
      ? [
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(name,href))`,
          session,
        ]
      : null,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Playlist Details</h1>
      <ul>
        {data.items.map((item, index) => (
          <li key={index}>
            <h2>{item.track.name}</h2>
            <p>
              Link:{" "}
              <a
                href={item.track.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on Spotify
              </a>
            </p>
            <p>Album: {item.track.album.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
