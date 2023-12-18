import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import MediaGridList from '../../components/MediaGridList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ApiService from '../../services/ApiService';
import FollowedPeopleStorageService from '../../services/FollowedPeopleStorageService';
import placeholder_poster from '../../assets/images/placeholder_poster.png';
import { SessionContext } from '../../contexts/SessionContext';
import LoadableImage from '../../components/LoadableImage';
import SwitchButtons from '../../components/SwitchButtons';


const switchOptions = [
  { label: 'Filmes', value: ApiService.MediaType.MOVIE },
  { label: 'Séries', value: ApiService.MediaType.TV },
]


export default function FollowingScreen() {

  const {session} = useContext(SessionContext);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [followedPeople, setFollowedPeople] = useState([]);
  const [data, setData] = useState(null);
  const [mediaType, setMediaType] = useState(ApiService.MediaType.MOVIE);

  // NOTE: if there is no result, the api returns page 1 and total pages 0
  const isLastPage = data == null || data.page >= data.total_pages;


  useEffect(() => {
    async function loadFollowedPeople() {
      try {
        const followedPeople = await FollowedPeopleStorageService.getFollowedPeople(session.user.id);
        setFollowedPeople(followedPeople);
        setIsLoadingPeople(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadFollowedPeople();
  }, []);

  useEffect(() => {
    async function loadData() {
      if(followedPeople.length === 0) {
        setData(null);
        return;
      }

      try {
        setIsLoadingMedia(true);

        const peopleIds = followedPeople.map(person => person.id);
        let data = null;

        if(mediaType === ApiService.MediaType.MOVIE) {
          data = await ApiService.fetchMoviesWithPeople(peopleIds);
        } else if (mediaType === ApiService.MediaType.TV) {
          // ISSUE: there's no with_people for tv on the api
          // data = await ApiService.fetchTvShowsWithPeople(peopleIds);
          throw new Error('No tv with people implemented.');
        }
        setData(data);
        setIsLoadingMedia(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadData();
  }, [followedPeople, mediaType])
  

  // TODO: updating only movies, verify if tv to fetch tv with people
  async function updateData() {
    if(isLastPage) return;

    const page = data.page + 1;

    try {
      const peopleIds = followedPeople.map(person => person.id);
      const data = await ApiService.fetchMoviesWithPeople(peopleIds, page);
      
      setData(prev => ({
        ...data,
        results: [...prev.results, ...data.results],
      }));
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleUnfollow(personId) {
    try {
      await FollowedPeopleStorageService.removeFollowedPerson(session.user.id, personId);
      const updatedFollowedPeople = await FollowedPeopleStorageService.getFollowedPeople(session.user.id);
      setFollowedPeople(updatedFollowedPeople);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  if(isLoadingPeople) {
    return(
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View>
    );
  }

  if(followedPeople.length === 0) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text style={{color: '#333', fontSize: 18}}>
          Você ainda não segue ninguém.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* people */}
      <View style={styles.peopleCardsContainer}>
        <FlatList
          horizontal
          contentContainerStyle={styles.peopleFlatlistContentContainer}
          data={followedPeople}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <View style={styles.personCardContainer}>
              <LoadableImage
                style={styles.personCardImage}
                source={{uri: ApiService.fetchFullImagePath(item.profile_path)}}
                placeholder={placeholder_poster}
              />
              <Text style={styles.personCardText} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity style={styles.unfollowButtonContainer} onPress={() => handleUnfollow(item.id)}>
                <FontAwesome name="user-times" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={<View style={{width: 20}} />}
        />
      </View>

      {/* media */}
      <View style={styles.moviesGridContainer}>
        <SwitchButtons
          style={{padding: 14, alignSelf: 'flex-end'}}
          options={switchOptions}
          value={mediaType}
          onChangeSelection={setMediaType}
        />

        {isLoadingMedia ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator color={'white'} size={'large'} />
          </View>
        ) : (
          <MediaGridList
            mediaDataList={data.results}
            onEndReached={updateData}
            showLoadingMoreIndicator={!isLastPage}
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  peopleFlatlistContentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  peopleCardsContainer: {
    backgroundColor: '#222',
  },
  personCardContainer: {
    width: 100,
  },
  personCardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2/3,
    borderRadius: 4,
  },
  personCardText: {
    color: '#fff',
  },
  unfollowButtonContainer: {
    height: 34,
    width: 34,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -10,
    left: -10,
    borderRadius: 4,
  },
  moviesGridContainer: {
    flex: 1,
  },
  moviesGridTitle: {
    color: '#fff',
    fontSize: 24,
    marginHorizontal: 10,
    marginVertical: 10,
  },
});