import { useContext, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import { SignedUserContext } from "../App";
import SessionStorageService from "../services/SessionStorageService";
import MediaGridList from "../components/MediaGridList";
import SwitchButtons from "../components/SwitchButtons";

// TODO: add tv favorites
// TODO: infinite scroll
// ISSUE: gridmovielist needs to be addapted to tv, right now it opens movie details
// when a show is selected

const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FavoritesScreen() {

  const {signedUser} = useContext(SignedUserContext);
  const [favorites, setFavorites] = useState(null);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);


  useEffect(() => {
    async function loadFavorites() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
        const data = await ApiService.fetchFavorites( signedUser.id, sessionId, mediaType);

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
        style={{padding: 14, alignSelf: 'flex-end'}}
        options={switchOptions}
        value={mediaType}
        onChangeSelection={setMediaType}
      />
      <MediaGridList
        mediaData={favorites?.results}
        mediaType={mediaType}
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