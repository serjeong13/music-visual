import { useRouter } from "next/router";
import useSwr from "swr";
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
      <h1>Spotify Player</h1>
      <WebPlayBack token={data?.token} track={data?.track} />
    </div>
  );
}
