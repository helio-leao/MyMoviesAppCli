import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootTabNavigator from './navigation/RootTabNavigator';
import { SessionProvider } from './contexts/SessionContext';

// TODO: "remove favorite" functionality

// TODO: selection of people for media filtering (FollowingScreen)

// TODO: add media names below the cards. might solve cases where media has no image

// NOTE: change the way the components identify media type? add it to each element
// "movie", "tv" and "person" api returns that do not have it by default like
// "multi"? or keep sending a string "mediaType" that's used for this (current).
// both have problems, mediaType for all doesn't allow for mixed and adding media type
// to all objects require aditional code and processing.

// TODO: review "person following" business rule. will the user need to be logged in? if not,
// will it be universal (not good). if not, will it stay there in case of inactivity?

// ISSUE: api may return many items with same id on cast and crew (PersonDetailsScreen)


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