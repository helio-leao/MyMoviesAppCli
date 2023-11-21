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

// TODO: add media names below the cards. might solve cases where media has no image

// TODO: fetch images with correct size for better performance

// NOTE: change the way the components identify media type? add it to each element
// "movie", "tv" and "person" api returns that do not have it by default like
// "multi"? or keep sending a string "mediaType" that's used for this (current method).
// both have problems, mediaType for all doesn't allow for mixed and adding media type
// to all objects require aditional code, processing and memory.

// NOTE: rethink the way cast and crew is rendered to avoid duplicates on media and person
// detail screens

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