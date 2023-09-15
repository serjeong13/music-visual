import Navbar from "../components/Navbar/index";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <>
      {router.pathname !== "/" && <Navbar />}
      <main>{children}</main>
    </>
  );
}
