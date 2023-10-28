import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import RowMovieList from '../components/RowMovieList';
import { ImagePlaceholder } from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import ApiService from '../services/ApiService';
import { SignedUserContext } from '../App';
import AuthStorageService from '../services/AuthStorageService';


export default function MovieDetailsScreen() {

  const {signedUser} = useContext(SignedUserContext);
  const [movieData, setMovieData] = useState(null);
  const route = useRoute();


  useEffect(() => {
    async function getMovieDetails() {
      try {
        const movieDetails = await ApiService.fetchMovieDetails(route.params.id);
        setMovieData(movieDetails);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    getMovieDetails();
  }, []);


  // NOTE: verify if error response comes in the same object if outside try/catch block
  async function onFavoritePress() {
    try {
      const sessionId = await AuthStorageService.getSessionId();
      const response = await ApiService.addFavorite(
        signedUser.id,
        sessionId,
        {...movieData, media_type: ApiService.MediaType.MOVIE}
      );

      if(response.success) {
        ToastAndroid.show('Filme favoritado.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('error response: ', error.response.data);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  return (
    <View style={styles.container}>
      {/* image */}
      <Image
        style={styles.backdropImage}
        source={movieData?.backdrop_path ?
          {uri: ApiService.fetchFullImagePath(movieData.backdrop_path)}
          : ImagePlaceholder.BACKDROP
        }
      />
      
      {/* gradient container */}
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#111', '#11111100']}
        start={{x: 0, y: 0.15}} end={{x: 0, y: 0}}
      >
        {/* title */}
        <Text style={styles.title} numberOfLines={2}>
          {movieData?.title}
        </Text>
        
        {/* genres */}
        <View>
          <ScrollView horizontal>
            <View style={styles.genresContainer}>
              {movieData?.genres.map(genre => (
                <View key={genre.id} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView>
          <View style={styles.contentScrollContainer}>

            {/* ratings and watch later button */}
            <View style={styles.ratingsAndWatchLaterContainer}>
              <View style={styles.ratingsContainer}>
                <Fontisto name="star" size={30} color="yellow" />
                <View>
                  <Text style={styles.contentText}>
                    <Text style={styles.ratingsText}>
                      {movieData?.vote_average.toFixed(1)}
                    </Text>
                    {'/10'}
                  </Text>
                  <Text style={styles.contentText}>{movieData?.vote_count}</Text>
                </View>
              </View>

              {signedUser && (
                <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                  <FontAwesome name="heart" size={20} color="white" />
                  <Text style={styles.favoriteButtonText}>Favoritar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{marginHorizontal: 10}}>
              <Text style={styles.contentText}>
                Direção: {movieData?.credits.crew
                  .filter(person => person.job === ApiService.CrewJob.DIRECTOR)
                  .map(director => director.name)
                  .slice(0, 3)
                  .join(', ')}
              </Text>
              <Text style={styles.contentText}>
                Roteiro: {movieData?.credits.crew
                  .filter(person => person.job === ApiService.CrewJob.SCREENPLAY ||
                    person.job === ApiService.CrewJob.WRITER || person.job === ApiService.CrewJob.AUTHOR)
                  .map(writer => writer.name)
                  .slice(0, 3)
                  .join(', ')}
              </Text>
              <Text style={[styles.contentText, {marginBottom: 20}]}>
                Elenco: {movieData?.credits.cast
                  .map(actor => actor.name)
                  .slice(0, 3)
                  .join(', ')}
              </Text>
              {movieData?.overview && (
                <Text style={[styles.contentText, {marginBottom: 20}]}>
                  {movieData.overview}
                </Text>
              )}
              <Text style={styles.contentText}>
                Título Original: {movieData?.original_title}
              </Text>
              <Text style={styles.contentText}>
                Lançamento: {movieData?.release_date &&
                  new Intl.DateTimeFormat('pt-BR').format(new Date(movieData.release_date))}
              </Text>
            </View>

            {movieData?.recommendations.total_results > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Recomendações
                </Text>
                <RowMovieList
                  moviesData={movieData.recommendations.results}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

          </View>
        </ScrollView>
        
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  backdropImage: {
    aspectRatio: 16/9,
    width: '100%',
    height: undefined,
  },
  gradientContainer: {
    flex: 1,
    marginTop: -100,
  },
  title: {
    marginTop: 40,
    fontSize: 40,
    color: '#fff',
    marginHorizontal: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 8,
  },
  genrePill: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  genreText: { 
    fontSize: 14,
    color: '#000'
  },
  ratingsAndWatchLaterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingsText: {
    fontSize: 20,
    fontWeight: '800',
  },
  favoriteButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButtonText: {
    color: '#fff',
  },
  contentScrollContainer: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#fff',
  },
  recommendationsRowTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
});