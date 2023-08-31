import Image from "next/image";
import { SpotifyLogin } from "../../components/SpotifyLogin";

export default function Home() {
  return (
    <main>
      <h1>HELLO MACE! I am back!</h1>
      <SpotifyLogin />
    </main>
  );
}
