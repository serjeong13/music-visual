import { useRouter } from "next/router";
import useSwr from "swr";
import WebPlayBack from "../../../components/WebPlayBack";
import { fetcherToken } from "../../../public/lib/fetcher";

export default function TrackPage() {
  const router = useRouter();
  const { trackId } = router.query;

  // Using SWR to fetch track details
  const { data, error } = useSwr(
    trackId ? `/api/track/${trackId}` : null,
    fetcherToken
  );

  if (error)
    return (
      <div className="text-red-600 font-medium">Error: {error.message}</div>
    );
  if (!data) return <div className="text-gray-500 font-medium">Loading...</div>;

  if (!data.track) {
    return (
      <div className="text-yellow-600 font-medium">
        Track details are not available.
      </div>
    );
  }

  return (
    <div className="p-4 mt-16">
      <WebPlayBack token={data?.token} track={data?.track} />
    </div>
  );
}
