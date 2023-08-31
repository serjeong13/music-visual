import { useSession } from "../../src/contexts/SessionContext";
import { signIn, signOut } from "next-auth/react";

export const SpotifyLogin = () => {
  const { session, error } = useSession();

  console.log("Session in SpotifyLogin:", session);

  // Check if the user is logged in
  if (session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  // If there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Default, when no session or error
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};
