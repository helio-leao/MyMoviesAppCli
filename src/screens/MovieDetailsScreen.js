import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import RowMovieList from '../components/RowMovieList';
import { ImagePlaceholder } from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import ApiService from '../services/ApiService';


export default function MovieDetailsScreen() {

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


  function onWatchLaterPress() {
    console.log('TODO: watch later press, id', movieData.id);
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

              {/* <TouchableOpacity style={styles.watchLaterButton} onPress={onWatchLaterPress}>
                <FontAwesome name="clock-o" size={20} color="white" />
                <Text style={styles.watchLaterButtonText}>Ver Depois</Text>
              </TouchableOpacity> */}
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
  watchLaterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  watchLaterButtonText: {
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