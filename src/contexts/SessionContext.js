import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const sessionData = await getSession();
      if (sessionData) {
        setSession(sessionData);
      }
    }

    fetchData();
  }, []);

  const value = {
    session,
    setSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
