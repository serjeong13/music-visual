import Navbar from "../components/Navbar/index";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <>
      <main>{children}</main>
      {router.pathname !== "/" && <Navbar />}
    </>
  );
}
