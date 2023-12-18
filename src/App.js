import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { SessionProvider } from './contexts/SessionContext';

// TODO: bell notification for new movies from followed people

// TODO: looks like it's not possible to rate a movie that's not yet released.
// test it and verify the release date to render rating button or not

// TODO: verify if total ratings changes when user adds a rating, in which case it
// will be necessary to fetch the movie again after a modification in favorites or
// rating. this is the right thing, but slower

// TODO: "react-native-keep-awake" for video playing

// TODO: prevent orientation change on MediaDetailsScreen

// TODO: operations that use session id might throw errors if session deleted on tmdb
// webpage. adjust all operations that use session id, start by session context.
// reproduced by deleting the session after logged and opening the app again or with
// the app open delete session on website and try any operation that requires the id

// TODO: add possibility to remove movies from specific followed people on FollowingScreen

// TODO: fetch images with correct size for better performance


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