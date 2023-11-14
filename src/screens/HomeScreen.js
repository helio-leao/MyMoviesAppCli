import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, ToastAndroid } from 'react-native';
import ApiService from '../services/ApiService';
import MediaRowList from '../components/MediaRowList';


export default function HomeScreen() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [trendingTvShows, setTrendingTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadMoviesData() {
      try {
        const [
          popularMoviesData,
          trendingMoviesData,
          popularTvShowsData,
          trendingTvShowsData
        ] = await Promise.all([
          ApiService.fetchPopularMovies(),
          ApiService.fetchTrendingMovies(),
          ApiService.fetchPopularTvShows(),
          ApiService.fetchTrendingTvShows()
        ]);
  
        setPopularMovies(popularMoviesData.results);
        setTrendingMovies(trendingMoviesData.results);
        setPopularTvShows(popularTvShowsData.results);
        setTrendingTvShows(trendingTvShowsData.results);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
      }
    }
    loadMoviesData();
  }, []);


  if(isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator color={'white'} size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>      

        <View style={styles.moviesRowsContainer}>
          <View>
            <Text style={styles.moviesRowTitle}>Filmes populares</Text>
            <MediaRowList
              mediaData={popularMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
              mediaType={ApiService.MediaType.MOVIE}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Filmes em alta</Text>
            <MediaRowList
              mediaData={trendingMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
              mediaType={ApiService.MediaType.MOVIE}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Séries populares</Text>
            <MediaRowList
              mediaData={popularTvShows}
              contentContainerStyle={styles.moviesRowContentContainer}
              mediaType={ApiService.MediaType.TV}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Séries em alta</Text>
            <MediaRowList
              mediaData={trendingTvShows}
              contentContainerStyle={styles.moviesRowContentContainer}
              mediaType={ApiService.MediaType.TV}
            />
          </View>
        </View>

      </ScrollView>
    </View>      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  moviesRowsContainer: {
    gap: 40,
    paddingVertical: 20,
  },
  moviesRowTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 14,
    marginHorizontal: 20,
  },
  moviesRowContentContainer: {
    paddingHorizontal: 20,
  },
});