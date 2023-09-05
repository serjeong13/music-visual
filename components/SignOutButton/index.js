import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut()} className="btn btn-primary mx-auto my-2">
      Sign out
    </button>
  );
}
