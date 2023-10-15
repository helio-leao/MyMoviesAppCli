import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { fetchMoviesWithPeople, getFullImagePath } from '../services/apiService';
import MoviesGrid from '../components/GridMovieList';
import { ImagePlaceholder } from '../constants/images';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getFollowedPeople, removeFollowedPerson } from '../services/storageService';


// TODO: roll to top of flatlist on unfollow
// TODO: simplify the logic for pageData and moviesData


export default function SearchScreen() {

  const [followedPeople, setFollowedPeople] = useState([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [moviesData, setMoviesData] = useState([]);


  useEffect(() => {
    async function loadFollowedPeople() {
      try {
        const followedPeople = await getFollowedPeople();
        setFollowedPeople(followedPeople);
        setIsLoadingPeople(false);
      } catch (error) {
        console.error(error);
        // ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
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
      const {results, ...pageData} = await fetchMoviesWithPeople(peopleIds);
      setPageData(pageData);
      setMoviesData(results);
    } catch (error) {
      console.error(error);
      // ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function loadMoreMovies(page) {
    try {
      const peopleIds = followedPeople.map(person => person.id);
      const {results, ...pageData} = await fetchMoviesWithPeople(peopleIds, page);
      setPageData(pageData);
      setMoviesData(prev => [...prev, ...results]);
    } catch (error) {
      console.error(error);
      // ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleUnfollow(id) {
    try {
      await removeFollowedPerson(id);
      const updatedFollowedPeople = await getFollowedPeople();
      setFollowedPeople(updatedFollowedPeople);
    } catch (error) {
      console.log(error);
      // ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
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
          contentContainerStyle={styles.peopleFlatlistContentContainer}
          horizontal={true}
          data={followedPeople}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <View testID={String(item.id)}>
              <Image
                style={styles.personCardImage}
                source={{uri: getFullImagePath(item.profile_path) || ImagePlaceholder.PROFILE}}
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
        <MoviesGrid
          moviesData={moviesData}
          onEndReached={onEndReached}
          showLoadingMoreIndicator={!isLastPage()}
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
