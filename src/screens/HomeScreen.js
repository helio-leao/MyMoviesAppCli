import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { fetchPopularMovies, fetchPopularTvShows, fetchTrendingMovies, fetchTrendingTvShows } from '../services/apiService';
import RowMediaList from '../components/RowMediaList';

// ISSUE: there's a bug where popular movies and popular tv shows don't come with media_type from api
// it sends by default to movie details screen, fix needed

export default function HomeScreen() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [dayTrendingMovies, setDayTrendingMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [dayTrendingTvShows, setDayTrendingTvShows] = useState([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);


  useEffect(() => {
    async function loadMoviesData() {
      try {
        setPopularMovies((await fetchPopularMovies()).results);
        setDayTrendingMovies((await fetchTrendingMovies()).results);
        setPopularTvShows((await fetchPopularTvShows()).results);
        setDayTrendingTvShows((await fetchTrendingTvShows()).results);
        setShowLoadingIndicator(false);
      } catch (error) {
        console.error(error);
        // ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
      }
    }
    loadMoviesData();
  }, []);


  if(showLoadingIndicator) {
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
            <RowMediaList
              moviesData={popularMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Filmes em alta</Text>
            <RowMediaList
              moviesData={dayTrendingMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Séries populares</Text>
            <RowMediaList
              moviesData={popularTvShows}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Séries em alta</Text>
            <RowMediaList
              moviesData={dayTrendingTvShows}
              contentContainerStyle={styles.moviesRowContentContainer}
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