import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { SessionProvider } from './contexts/SessionContext';

// TODO: "rating media" funcionality

// TODO: "react-native-keep-awake" for video playing

// TODO: prevent orientation change on MediaDetailsScreen

// TODO: share list of favorites and/or movie pages

// TODO: scroll flatlist up on new search

// TODO: invert cast and crew order on PersonDetailsScreen depending on person's
// known for job

// TODO: operations that use session id might throw errors if session deleted on tmdb
// webpage. adjust all operations that use session id, start by session context.
// reproduced by deleting the session after logged and opening the app again or with
// the app open delete session on website and try any operation that requires the id

// TODO: add possibility to remove movies from specific followed persons on FollowingScreen

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