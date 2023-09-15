import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Archive() {
  const [tracks, setTracks] = useState([]);
  const { data: session } = useSession();

  let email;
  if (session) {
    email = session.session.user.email;
  }
  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        const res = await fetch("/api/getTracksList");
        const { data } = await res.json();
        setTracks(data);
      };
      fetchData();
    }
  }, [email]);

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {tracks.map((track) => (
          <li key={track.trackId} className="border-b border-gray-300 pb-2">
            <Link
              href={`/reflectionPage?email=${email}&trackId=${track.trackId}`}
              className="flex items-center space-x-4"
            >
              <Image
                src={track.trackImage}
                alt={track.trackName}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                {" "}
                <h2 className="text-lg font-bold">{track.trackName}</h2>
                <p className="text-sm text-gray-500">by {track.artistName}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
