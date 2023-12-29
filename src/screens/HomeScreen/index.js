import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, ToastAndroid, TouchableOpacity } from 'react-native';
import ApiService from '../../services/ApiService';
import MediaRowList from '../../components/MediaRowList';
import LoadableImage from '../../components/LoadableImage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import placeholder_poster from '../../assets/images/placeholder_poster.png';

const TOP_TRENDING_MOVIE_INDEX = 0;


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
          trendingTvShowsData,
        ] = await Promise.all([
          ApiService.fetchTrendingMovies(),
          ApiService.fetchTrendingTvShows(),
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
          onPress={() => navigation.push('MediaDetailsScreen', {
              mediaId: trendingMovies[TOP_TRENDING_MOVIE_INDEX].id,
              mediaType: trendingMovies[TOP_TRENDING_MOVIE_INDEX].media_type
            },
          )}
        >
          <LoadableImage
            style={{
              width: '100%',
              height: undefined,
              aspectRatio: 16/9
            }}
            source={{uri: ApiService.fetchFullImagePath(
              trendingMovies[TOP_TRENDING_MOVIE_INDEX].backdrop_path)}}
            placeholder={placeholder_poster}
          />
          <LinearGradient
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              justifyContent: 'center',
            }}
            colors={['#111111ff', '#11111100']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <View style={{marginLeft: 20}}>
              <Text
                style={{                
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 10,
                }}
                numberOfLines={2}
              >
                {trendingMovies[TOP_TRENDING_MOVIE_INDEX].title}
              </Text>
              <Text
                style={{                
                  color: '#fff',
                }}
                numberOfLines={4}
              >
                {trendingMovies[TOP_TRENDING_MOVIE_INDEX].overview}
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