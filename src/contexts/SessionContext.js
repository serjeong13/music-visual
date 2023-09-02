import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

// Initialize the context with a default shape
export const SessionContext = createContext({
  session: null,
  setSession: () => {},
  error: null,
  setError: () => {},
  playlists: null,
  setPlaylists: () => {},
});

// A custom hook for components to access the session context
export function useSession() {
  return useContext(SessionContext);
}

// Provides session data to all child components
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  // Fetch the session when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        setError(error);
      }
    };

    fetchSession();
  }, []);

  // Define the context value
  const value = {
    session,
    setSession,
    error,
    setError,
    playlists,
    setPlaylists,
  };

  // Provide the session context to child components
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
