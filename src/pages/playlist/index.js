import { useSession } from "next-auth/react";
import useSWR from "swr";
import PlaylistDisplay from "../../../components/PlaylistDisplay";
import fetcher from "../../../public/lib/fetcher";

export default function Home() {
  const { data: session } = useSession();
  const { data: list, error } = useSWR(
    session ? "/api/playlists" : null,
    fetcher
  );

  if (error)
    return <div className="text-center mt-16">Error loading playlists.</div>;
  if (!list) return <div className="text-center mt-16">Loading...</div>;

  return (
    <div className="text-center mt-16">
      <PlaylistDisplay list={list} />
    </div>
  );
}
