import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <button onClick={goBack}>Back</button>

      <button onClick={() => navigateTo("/")}>Home</button>

      <button onClick={() => navigateTo("/archive")}>Archive</button>
    </nav>
  );
}
