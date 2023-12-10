import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, ToastAndroid, TouchableOpacity } from 'react-native';
import ApiService from '../services/ApiService';
import MediaRowList from '../components/MediaRowList';
import LoadableImage from '../components/LoadableImage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTvShows, setTrendingTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();


  useEffect(() => {
    async function loadMoviesData() {
      try {
        const [
          trendingMoviesData,
          trendingTvShowsData
        ] = await Promise.all([
          ApiService.fetchTrendingMovies(),
          ApiService.fetchTrendingTvShows()
        ]);
  
        setTrendingMovies(trendingMoviesData.results);
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
    return(
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>

        {/* TOP TRENDING MOVIE CARD */}
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={() => navigation.push(
            'MediaDetailsScreen',
            {
              mediaId: trendingMovies[0].id,
              mediaType: trendingMovies[0].media_type
            },
          )}
        >
          <LoadableImage
            style={{width: '100%', height: undefined, aspectRatio: 16/9}}
            source={{uri: ApiService.fetchFullImagePath(trendingMovies[0].backdrop_path)}}
          />
          <LinearGradient
            style={{position: 'absolute', width: '70%', height: '100%', paddingHorizontal: 10, paddingVertical: 40}}
            colors={['#111111ff', '#11111100']}
            start={{x: 0.5, y: 0}}
            end={{x: 1, y: 0}}
          >
            <View style={{width: '100%', height: '100%'}}>
              <Text
                style={{                
                  fontSize: 30,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 10,
                }}
                numberOfLines={2}
              >
                  {trendingMovies[0].title}
              </Text>
              <Text
                style={{                
                  fontSize: 16,
                  color: '#fff',
                }}
                numberOfLines={3}
              >
                  {trendingMovies[0].overview}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        {/* END TOP TRENDING MOVIE CARD */}

        <View style={styles.moviesRowsContainer}>
          <View>
            <Text style={styles.moviesRowTitle}>Filmes em alta</Text>
            <MediaRowList
              mediaDataList={trendingMovies}
              contentContainerStyle={styles.moviesRowContentContainer}
            />
          </View>

          <View>
            <Text style={styles.moviesRowTitle}>Séries em alta</Text>
            <MediaRowList
              mediaDataList={trendingTvShows}
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
    gap: 30,
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