import { createContext, useEffect, useState } from "react";
import SessionStorageService from "../services/SessionStorageService";
import ApiService from "../services/ApiService";
import { ToastAndroid } from "react-native";


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
        console.log(error);
      }
    }
    loadSessionData();
  }, []);


  async function handleLogin(sessionId, signedUser) {
    try {
      await SessionStorageService.setSessionId(sessionId);
      setSession({id: sessionId, user: signedUser});
    } catch (error) {
      console.log('error: ', error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleLogout() {
    try {
      await SessionStorageService.deleteSessionId();
      setSession(null);
    } catch (error) {
      console.log('error: ', error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  return (
    <SessionContext.Provider
      value={{
        session,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}