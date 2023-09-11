import { useRouter } from "next/router";
import useSWR from "swr";
import SpotifyPlayer from "../../../components/SpotifyPlayer";
import { useEffect } from "react";

export default function PlayerPage() {
  // Using Next.js router to capture dynamic route parameters
  const router = useRouter();
  const { playTrackId } = router.query;

  // Fetcher function for SWR, using the session token for Authorization
  const fetcher = async (url, refreshToken) => {
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (!res.ok) {
        console.error(`Fetch Error. Status Code: ${res.status}`);
        throw new Error("An error occurred while fetching the data");
      }
      return res.json();
    } catch (error) {
      console.error(`Fetch Error: ${error.message}`);
      throw new Error("Network response was not ok");
    }
  };

  // Using SWR to fetch playlist details
  const { data, error } = useSWR(
    playTrackId ? `/api/playTrack/${playTrackId}` : null,
    fetcher
  );

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Spotify Player</h1>
      {/* <SpotifyPlayer playTrackId={playTrackId} /> */}
      <ul>
        {data && data.track ? (
          <li key={data?.track?.id}>
            <h2> Song: {data?.track?.name || "Unknown Track"}</h2>
            <p>By: {artistName}</p>
          </li>
        ) : (
          <p>Song is not available</p>
        )}
      </ul>
    </div>
  );
}
