import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  //console.log("Session Data:", session);

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
        Signed in as {session?.token?.email} <br />
        <button
          onClick={() => signOut()}
          className="btn btn-primary mx-auto my-2"
        >
          Sign out
        </button>
        <hr />
        <button
          onClick={getMyPlaylists}
          className="btn btn-secondary mx-auto my-2"
        >
          Get my playlists
        </button>
        {list &&
          list.map((item) => (
            <div key={item.id} className="flex justify-end items-center my-4">
              <h1 className="text-lg font-bold mx-4">{item.name}</h1>
              <Image
                src={item.images[0]?.url}
                alt={item.name}
                width={300}
                height={300}
              />
            </div>
          ))}
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()} className="btn btn-primary mx-auto my-2">
        Sign in
      </button>
    </>
  );
}
