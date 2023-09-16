import { useSession } from "next-auth/react";
import SignOutButton from "../../components/SignOutButton";
import SignInButton from "../../components/SignInButton";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../../public/lib/fetcher";

export default function Home() {
  const { data: session } = useSession();
  const { data: list, error } = useSWR(
    session ? "/api/playlists" : null,
    fetcher
  );

  if (error) return <div>Error loading playlists.</div>;

  if (session) {
    if (!list) {
      return <div>Loading...</div>;
    }
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
        <p className="mb-8 font-bold">
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
      <p className="mb-8 font-bold">
        Music Visual is a new journey through your favorite tracks with creating
        a visual experience from AI.
      </p>
      <p>Simply link your Spotify account to get started. </p>
      <SignInButton />
    </div>
  );
}
