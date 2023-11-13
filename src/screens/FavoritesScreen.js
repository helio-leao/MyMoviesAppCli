import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import { SignedUserContext } from "../App";
import SessionStorageService from "../services/SessionStorageService";
import GridMovieList from "../components/GridMovieList";
import SwitchButtons from "../components/SwitchButtons";

// TODO: add tv favorites
// ISSUE: gridmovielist needs to be addapted to tv, right now it opens movie details
// when a show is selected

const mediaOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FavoritesScreen() {

  const {signedUser} = useContext(SignedUserContext);
  const [favorites, setFavorites] = useState(null);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE); // movies or tv


  useEffect(() => {
    console.log(mediaType)
    async function loadFavorites() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
        const data = await ApiService.fetchFavorites(signedUser.id, sessionId, mediaType);

        setFavorites(data);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }

    }
    loadFavorites();
  }, [mediaType]);


  return(
    <View style={styles.screenContainer}>
      <SwitchButtons
        style={{padding: 20, alignSelf: 'flex-end'}}
        options={mediaOptions}
        value={mediaType}
        onChangeSelection={setMediaType}
      />
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