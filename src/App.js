import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { SessionProvider } from './contexts/SessionContext';

// TODO: "remove favorite" functionality

// TODO: operations that use session id might throw errors if session deleted on tmdb
// webpage. adjust all operations that use session id, start by session context.
// reproduced by deleting the session after logged and opening the app again or with
// the app open delete session on website and try any operation that requires the id

// TODO: add activity indicators for loading grids and maybe rows

// TODO: selection of people for media filtering (FollowingScreen)

// TODO: fetch images with correct size for better performance

// TODO: use "multi" instead of "movies credits" and "tv credits" on person details screen???
// start by changing the code on api service. 


export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor='#000' />

      <NavigationContainer>
        <SessionProvider>
          <RootTabNavigator />
        </SessionProvider>
      </NavigationContainer>
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