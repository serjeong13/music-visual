import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SignOutButton from "../../components/SignOutButton";
import SignInButton from "../../components/SignInButton";
import PlaylistDisplay from "../../components/PlaylistDisplay";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  console.log("session---------------", session);

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
        <h1 className="text-3xl font-bold text-center">Music Visual</h1>
        <img
          src="https://picsum.photos/200/300"
          alt="random"
          className="mx-auto"
        />
        <p className="mb-8">
          Music Singal lorem5 Singal lorem5 Singal lorem5 Singal lorem5 Singal
          lorem5 Singal lorem5{" "}
        </p>
        <p className="text-lg font-bold mb-8">
          You are signed in as {session?.token?.email}
        </p>
        <div>
          <Link href="/playlist" className="">
            Explore your playlists
          </Link>
        </div>

        <SignOutButton />
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
        Music Singal lorem5 Singal lorem5 Singal lorem5 Singal lorem5 Singal
        lorem5 Singal lorem5
      </p>
      <SignInButton />
    </div>
  );
}
