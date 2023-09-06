import { useRouter } from "next/router";
import useSWR from "swr";
import { useSession } from "next-auth/react";

// Fetcher function for SWR, using the session token for Authorization
const fetcher = async (url, refreshToken) => {
  try {
    const res = await fetch(url, refreshToken);
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data");
    }
    return res.json();
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};

export default function PlaylistPage() {
  // Using NextAuth useSession hook for session management
  const { data: session } = useSession();
  const accessToken = session?.token?.accessToken || "";
  console.log("accessToken", accessToken);

  // Using Next.js router to capture dynamic route parameters
  const router = useRouter();
  //console.log("Router query:", router.query);
  const { playlistId } = router.query;

  // Using SWR to fetch playlist details
  const { data, error } = useSWR(
    // Conditional fetching, based on whether playlistId exists
    playlistId ? [`/api/tracks/${playlistId}`, accessToken] : null,
    fetcher
  );
  console.log("data", data);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Playlist Details</h1>
      <ul>
        {data.items.map((item) => (
          <li key={item.track.id}>
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
