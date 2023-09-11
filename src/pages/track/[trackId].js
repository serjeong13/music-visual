import { useRouter } from "next/router";
import useSwr from "swr";
import Link from "next/link";
// import SpotifyPlayer from "../../../components/SpotifyPlayer";
// import SpotifyWebPlayer from "../../../components/SpotifyWebPlayer";
import WebPlayBack from "../../../components/WebPlayBack";

// Fetcher function for SWR, using the session token for Authorization

export default function TrackPage() {
  const router = useRouter();
  const { trackId } = router.query;

  const fetcher = async (url, refreshToken) => {
    try {
      const res = await fetch(url, refreshToken);
      const jsonData = await res.json();
      return jsonData;
    } catch (error) {
      throw new Error("Network response was not ok");
    }
  };

  // Using SWR to fetch track details
  const { data, error } = useSwr(
    trackId ? `/api/track/${trackId}` : null,
    fetcher
  );

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  if (!data.track) {
    return <div>Track details are not available.</div>;
  }

  // getAuth token

  return (
    <div>
      <h1>Track Details</h1>
      <ul>
        {data && data.track ? (
          <li key={data?.track?.id}>
            <h2> Song: {data?.track?.name || "Unknown Track"}</h2>
            <p>By: {data?.track?.artists?.[0]?.name}</p>
            <p>from the Album: {data?.track?.album?.name}</p>
          </li>
        ) : (
          <p>Artist is not available</p>
        )}
      </ul>
      <br></br>
      <h2>Spotify Player</h2>
      {/* <SpotifyPlayer trackId={trackId} /> */}
      {/* <SpotifyWebPlayer trackId={trackId} /> */}
      <WebPlayBack token={data?.token} track={data?.track} />
    </div>
  );
}
