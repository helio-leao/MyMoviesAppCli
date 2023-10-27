import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { createContext, useEffect, useState } from 'react';
import AuthStorageService from './services/AuthStorageService';
import ApiService from './services/ApiService';


export const SignedUserContext = createContext();


export default function App() {

  const [signedUser, setSignedUser] = useState();


  useEffect(() => {
    async function loadSignedUser() {
      try {
        const sessionId = await AuthStorageService.getSessionId();
  
        if(sessionId) {
          // NOTE: can this return something that not user data???
          const signedUser = await ApiService.fetchAccountDetailsBySessionId(sessionId);
          setSignedUser(signedUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadSignedUser();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor='#000' />

      <SignedUserContext.Provider value={{signedUser, setSignedUser}}>
        <NavigationContainer>
          <RootTabNavigator />
        </NavigationContainer>
      </SignedUserContext.Provider>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});