import { createContext, useEffect, useState } from "react";
import SessionStorageService from "../services/SessionStorageService";
import ApiService from "../services/ApiService";


export const SessionContext = createContext();


export function SessionProvider ({children}) {
  const [signedUser, setSignedUser] = useState(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    async function loadSignedUser() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
  
        if(sessionId) {
          const signedUser = await ApiService.fetchAccountDetailsBySessionId(sessionId);
          setSignedUser(signedUser);
          setSessionId(sessionId);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadSignedUser();
  }, []);


  return (
    <SessionContext.Provider
      value={{
        signedUser,
        setSignedUser,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}