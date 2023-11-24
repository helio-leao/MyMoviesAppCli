import { createContext, useEffect, useState } from "react";
import SessionStorageService from "../services/SessionStorageService";
import ApiService from "../services/ApiService";


export const SessionContext = createContext();


export function SessionProvider ({children}) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSessionData() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
  
        if(sessionId) {
          const signedUser = await ApiService.fetchAccountDetailsBySessionId(sessionId);
          setSession({id: sessionId, user: signedUser});
        }
      } catch (error) {
        console.log('Fetch account details error:', error.response.data);
      }
    }
    loadSessionData();
  }, []);


  async function createSession(sessionId, signedUser) {
    await SessionStorageService.setSessionId(sessionId);
    setSession({id: sessionId, user: signedUser});
  }

  async function deleteSession() {
    await SessionStorageService.deleteSessionId();
    setSession(null);
  }


  return (
    <SessionContext.Provider
      value={{
        session,
        createSession,
        deleteSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}