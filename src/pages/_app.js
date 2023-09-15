import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import Layout from "../../components/layout";

// The main App component
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Wrap the entire application with the SessionProvider so all components have access to the session context
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
