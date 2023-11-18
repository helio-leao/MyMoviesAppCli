import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ToastAndroid } from 'react-native';
import MediaGridList from '../components/MediaGridList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ApiService from '../services/ApiService';
import StorageService from '../services/FollowedPeopleStorageService';
import placeholder_poster from '../assets/images/placeholder_poster.png';


// TODO: roll to top of flatlist on unfollow


export default function SearchScreen() {

  const [followedPeople, setFollowedPeople] = useState([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [moviesData, setMoviesData] = useState([]);


  useEffect(() => {
    async function loadFollowedPeople() {
      try {
        const followedPeople = await StorageService.getFollowedPeople();
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
    loadMovies();
  }, [followedPeople])


  async function loadMovies() {
    if(followedPeople.length === 0) {
      setPageData(null);
      setMoviesData([]);
      return;
    }
    try {
      const peopleIds = followedPeople.map(person => person.id);
      const {results, ...pageData} = await ApiService.fetchMoviesWithPeople(peopleIds);
      setPageData(pageData);
      setMoviesData(results);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function loadMoreMovies(page) {
    try {
      const peopleIds = followedPeople.map(person => person.id);
      const {results, ...pageData} = await ApiService.fetchMoviesWithPeople(peopleIds, page);
      setPageData(pageData);
      setMoviesData(prev => [...prev, ...results]);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleUnfollow(id) {
    try {
      await StorageService.removeFollowedPerson(id);
      const updatedFollowedPeople = await StorageService.getFollowedPeople();
      setFollowedPeople(updatedFollowedPeople);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  function onEndReached() {
    if(!isLastPage()) {
      return loadMoreMovies(pageData.page + 1);
    }
  }

  function isLastPage() {
    return pageData == null || pageData.page === pageData.total_pages;
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
            <View testID={String(item.id)}>
              <Image
                style={styles.personCardImage}
                source={item.profile_path ?
                  {uri: ApiService.fetchFullImagePath(item.profile_path)}
                  : placeholder_poster
                }
              />
              <TouchableOpacity style={styles.unfollowButtonContainer} onPress={() => handleUnfollow(item.id)}>
                <FontAwesome name="user-times" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={<View style={{width: 20}} />}
        />
      </View>

      {/* media */}
      <View style={styles.moviesGridContainer}>
        <Text style={styles.moviesGridTitle}>Filmes</Text>
        <MediaGridList
          mediaData={moviesData}
          onEndReached={onEndReached}
          showLoadingMoreIndicator={!isLastPage()}
          mediaType={ApiService.MediaType.MOVIE}
        />
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
    padding: 20,
  },
  peopleCardsContainer: {
    backgroundColor: '#222',
  },
  personCardImage: {
    width: 100,
    height: undefined,
    aspectRatio: 2/3,
    borderRadius: 4,
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