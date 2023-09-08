import { useSession } from "next-auth/react";
import { useState } from "react";
import SignOutButton from "../../components/SignOutButton";
import SignInButton from "../../components/SignInButton";
import PlaylistDisplay from "../../components/PlaylistDisplay";

export default function Home() {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  console.log("session on fireeeeeeee", session);

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

  if (session) {
    return (
      <>
        You are signed in as {session?.token?.email} <br />
        <SignOutButton />
        <hr />
        <button
          onClick={getMyPlaylists}
          className="btn btn-secondary mx-auto my-2"
        >
          Get my playlists
        </button>
        <PlaylistDisplay list={list} />
      </>
    );
  }
  return (
    <>
      Hello, please sign in <br />
      <SignInButton />
    </>
  );
}
