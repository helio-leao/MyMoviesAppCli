import { useCallback, useContext, useState } from "react";
import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import ApiService from "../../services/ApiService";
import MediaGridList from "../../components/MediaGridList";
import SwitchButtons from "../../components/SwitchButtons";
import { SessionContext } from "../../contexts/SessionContext";
import { useFocusEffect } from "@react-navigation/native";

// ISSUE: MediaGridList loading indicator showing even when list is empty


const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function RatedMediaScreen() {

  const {session} = useContext(SessionContext);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLastPage = data == null || data.page === data.total_pages;


  useFocusEffect(
    useCallback(() => {
      async function loadData() {      
        try {
          setIsLoading(true);
    
          const data = await ApiService.fetchRated(
            session.user.id, session.id, mediaType);
    
          setData(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
        }
      }
      loadData();
    }, [mediaType])
  );


  async function updateData() {
    if(isLastPage) return;

    const page = data.page + 1;

    try {
      const data = await ApiService.fetchRated(
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
          mediaDataList={data?.results}
          onEndReached={updateData}
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