import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Archive() {
  const [tracks, setTracks] = useState([]);
  const { data: session } = useSession();

  const email = session.session.user.email;
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/getTracksList");
      const { data } = await res.json();
      setTracks(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {tracks.map((trackId, index) => (
        <Link
          key={index}
          href={`/reflectionPage?email=${email}&trackId=${trackId}`}
        >
          <p>{trackId}</p>
        </Link>
      ))}
    </div>
  );
}
