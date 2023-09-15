import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PlaylistDisplay from "../../../components/PlaylistDisplay";

export default function Home() {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  const getMyPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists");
      if (response.ok) {
        const data = await response.json();
        setList(data.playlists);
      } else {
        console.error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("There was an error fetching the playlists:", error);
    }
  };

  useEffect(() => {
    if (session) {
      getMyPlaylists();
    }
  }, [session]);

  return (
    <div className="text-center mt-16">
      <PlaylistDisplay list={list} />
    </div>
  );
}
