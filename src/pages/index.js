import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SignOutButton from "../../components/SignOutButton";
import SignInButton from "../../components/SignInButton";
import PlaylistDisplay from "../../components/PlaylistDisplay";
import Link from "next/link";

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

  const checkUser = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(session?.session?.user),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    if (session) {
      getMyPlaylists();
      checkUser();
    }
  }, [session]);

  if (session) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to Music Visual
        </h1>
        <img
          src="https://picsum.photos/200/300"
          alt="random"
          className="mx-auto mb-8"
        />
        <p className="mb-8">
          You are set to start your music visual journey. Jump straight to your
          Spotify playlists.
        </p>
        <div className="mb-8">
          <Link href="/playlist">
            <button>Explore your playlists</button>
          </Link>
        </div>
        <p className="mb-8">
          Not sure you want to explore our app? No worries, there is always a
          way to sign out.
        </p>
        <div className="mb-8">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-center">Music Visual</h1>
      <img
        src="https://picsum.photos/200/300"
        alt="random"
        className="mx-auto"
      />
      <p className="mb-8">
        Music Visual is a new journey through your favorite tracks with creating
        a visual experience from AI.{" "}
      </p>
      <p>Simply link your Spotify account to get started. </p>
      <SignInButton />
    </div>
  );
}
