import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { fetcherToken } from "../../../public/lib/fetcher";

export default function PlaylistPage() {
  const router = useRouter();
  const { playlistId } = router.query;

  // Using SWR to fetch playlist details
  const { data, error } = useSWR(
    playlistId ? `/api/tracks/${playlistId}` : null,
    fetcherToken
  );

  if (error) return <div className="text-red-600">Error: {error.message}</div>;
  if (!data) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="p-4 mt-16">
      <ul className="space-y-4">
        {data.tracks.map((item) => (
          <li key={item.track.id} className="border-b border-gray-300 pb-4">
            <Link
              href={`/track/${item.track.id}`}
              className="flex items-center space-x-4"
            >
              <Image
                src={item.track.album.images[0].url}
                alt="album cover"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h2 className="text-lg font-bold">{item.track.name}</h2>
                <p className="text-sm text-gray-500">
                  by {item.track.artists[0].name}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
