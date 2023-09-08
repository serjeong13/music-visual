import { useRouter } from "next/router";
import useSwr from "swr";
import Link from "next/link";

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

  // Using SWR to fetch playlist details
  const { data, error } = useSwr(
    trackId ? `/api/track/${trackId}` : null,
    fetcher
  );

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  if (!data.track) {
    return <div>Track details are not available.</div>;
  }

  const artistName = data?.track?.artists?.[0]?.name;

  return (
    <div>
      <h1>Track Details</h1>
      <ul>
        {data && data.track ? (
          <li key={data?.track?.id}>
            <h2> Song: {data?.track?.name || "Unknown Track"}</h2>
            <p>By: {data?.track?.artists?.[0]?.name}</p>
            <p>from the Album: {data?.track?.album?.name}</p>
            <p>{data?.track?.album?.id}</p>
          </li>
        ) : (
          <p>Artist is not available</p>
        )}
      </ul>
      <br></br>
      <Link href={`/playTrack/${data?.track?.id}`}>Listen in the Player</Link>
    </div>
  );
}
