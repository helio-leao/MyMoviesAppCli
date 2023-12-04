import { useContext, useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import MediaGridList from "../components/MediaGridList";
import SwitchButtons from "../components/SwitchButtons";
import { SessionContext } from "../contexts/SessionContext";

// TODO: roll to top of flatlist on unfollow


const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FavoritesScreen() {

  const {session} = useContext(SessionContext);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);
  const [data, setData] = useState(null);

  const isLastPage = data == null || data.page === data.total_pages;


  useEffect(() => {
    async function loadData() {
      try {
        const data = await ApiService.fetchFavorites(
          session.user.id, session.id, mediaType);

        setData(data);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadData();
  }, [mediaType]);


  async function loadMoreData(page) {
    try {
      const data = await ApiService.fetchFavorites(
        session.user.id, session.id, mediaType, page);

      setData(prev => ({
        ...data,
        results: [...prev.results, ...data.results],
      }));
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  function onEndReached() {
    if(!isLastPage) {
      return loadMoreData(data?.page + 1);
    }
  }


  return(
    <View style={styles.screenContainer}>
      <SwitchButtons
        style={{padding: 14, alignSelf: 'flex-end'}}
        options={switchOptions}
        value={mediaType}
        onChangeSelection={setMediaType}
      />
      <MediaGridList
        mediaData={data?.results}
        onEndReached={onEndReached}
        showLoadingMoreIndicator={!isLastPage}
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