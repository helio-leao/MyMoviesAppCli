import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { fetchDayTrendingMovies, fetchPopularMovies, fetchTopRatedMovies } from '../services/apiService';
import RowMovieList from '../components/RowMovieList';


export default function HomeScreen() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [dayTrendingMovies, setDayTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);


  useEffect(() => {
    async function loadMoviesData() {
      try {
        setPopularMovies((await fetchPopularMovies()).results);
        setDayTrendingMovies((await fetchDayTrendingMovies()).results);
        setTopRatedMovies((await fetchTopRatedMovies()).results);
        setIsLoadingMovies(false);
      } catch (error) {
        console.error(error);
        // ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
      }
    }
    loadMoviesData();
  }, []);


  if(isLoadingMovies) {
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
            <Text style={styles.moviesRowTitle}>Populares</Text>
            <RowMovieList
              moviesData={popularMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Em alta</Text>
            <RowMovieList
              moviesData={dayTrendingMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Melhores avaliações</Text>
            <RowMovieList
              moviesData={topRatedMovies}
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