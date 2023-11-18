import { useContext, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import MediaGridList from "../components/MediaGridList";
import SwitchButtons from "../components/SwitchButtons";
import { SessionContext } from "../contexts/SessionContext";

// TODO: infinite scroll


const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FavoritesScreen() {

  const {signedUser, sessionId} = useContext(SessionContext);
  const [favorites, setFavorites] = useState(null);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);


  useEffect(() => {
    async function loadFavorites() {
      try {
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