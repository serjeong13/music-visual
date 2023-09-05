import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button onClick={() => signIn()} className="btn btn-primary mx-auto my-2">
      Sign in
    </button>
  );
}
