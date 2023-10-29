import { SafeAreaView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { createContext, useEffect, useState } from 'react';
import SessionStorageService from './services/SessionStorageService';
import ApiService from './services/ApiService';


export const SignedUserContext = createContext();


export default function App() {

  // NOTE: add sessionId and change context name for SessionDataContext???
  const [signedUser, setSignedUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadSignedUser() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
  
        if(sessionId) {
          // NOTE: can this return something that not user data???
          const signedUser = await ApiService.fetchAccountDetailsBySessionId(sessionId);
          setSignedUser(signedUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    loadSignedUser();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor='#000' />

      {isLoading ? (
        <ActivityIndicator size={'large'} color={'#fff'} />
      ) : (
        <SignedUserContext.Provider value={{signedUser, setSignedUser}}>
          <NavigationContainer>
            <RootTabNavigator />
          </NavigationContainer>
        </SignedUserContext.Provider>
      )}

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
  },
});