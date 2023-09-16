import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useSWR from "swr";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error("Failed to fetch data");
  }
  const { data = [] } = await res.json();
  return data;
};

export default function Archive() {
  const { data: session } = useSession();
  let email;

  if (session) {
    email = session.session.user.email;
  }

  // Using SWR to fetch the tracks
  const { data: tracks, error } = useSWR(
    email ? "/api/archive" : null,
    fetcher
  );

  if (error)
    return (
      <div className="text-red-600 font-medium">Error: {error.message}</div>
    );
  if (!tracks)
    return <div className="text-gray-500 font-medium">Loading...</div>;

  return (
    <div className="p-4 mt-16">
      <ul className="space-y-4">
        {tracks && tracks.length > 0 ? (
          tracks.map((track) => (
            <li key={track.trackId} className="border-b border-gray-300 pb-2">
              <Link
                href={`/reflection?email=${email}&trackId=${track.trackId}`}
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={track.trackImage}
                    alt="album cover"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-bold">{track.trackName}</h2>
                    <p className="text-sm text-gray-500">
                      by {track.artistName}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p>No tracks available.</p>
        )}
      </ul>
    </div>
  );
}
