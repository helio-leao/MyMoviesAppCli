import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import { SignedUserContext } from "../App";
import SessionStorageService from "../services/SessionStorageService";
import GridMovieList from "../components/GridMovieList";

// TODO: add tv favorites


export default function FavoritesScreen() {

  const {signedUser} = useContext(SignedUserContext);
  const [favorites, setFavorites] = useState(null);


  useEffect(() => {
    async function initializeData() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
        const data = await ApiService.fetchFavoriteMovies(signedUser.id, sessionId);

        setFavorites(data);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }

    }
    initializeData();
  }, []);


  return(
    <View style={styles.screenContainer}>
      <GridMovieList
        moviesData={favorites?.results}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
});