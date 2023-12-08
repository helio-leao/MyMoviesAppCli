import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import MediaGridList from "../components/MediaGridList";
import SwitchButtons from "../components/SwitchButtons";
import { SessionContext } from "../contexts/SessionContext";


const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FavoritesScreen() {

  const {session} = useContext(SessionContext);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLastPage = mediaData == null || mediaData.page === mediaData.total_pages;


  useEffect(() => {
    async function loadData() {      
      try {
        setIsLoading(true);

        const data = await ApiService.fetchFavorites(
          session.user.id, session.id, mediaType);

        setMediaData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadData();
  }, [mediaType]);


  async function loadMoreData() {
    try {
      const page = mediaData.page + 1;

      const data = await ApiService.fetchFavorites(
        session.user.id, session.id, mediaType, page);

      setMediaData(prev => ({
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
      return loadMoreData();
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

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={'white'} size={'large'} />
        </View>
      ) : (
        <MediaGridList
          mediaData={mediaData?.results}
          onEndReached={onEndReached}
          showLoadingMoreIndicator={!isLastPage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
});