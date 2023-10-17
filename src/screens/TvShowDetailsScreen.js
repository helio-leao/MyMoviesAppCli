import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ImagePlaceholder } from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import RowTvShowList from '../components/RowTvShowList';
import ApiService from '../services/ApiService';


function formatTvShowStatus(status) {
  switch (status) {
    case ApiService.TvShowStatus.RETURNING_SERIES:
      return 'Em Andamento';
    case ApiService.TvShowStatus.PLANNED:
      return 'Planejado';
    case ApiService.TvShowStatus.IN_PRODUCTION:
      return 'Em Produção';
    case ApiService.TvShowStatus.ENDED:
      return 'Terminado';
    case ApiService.TvShowStatus.CANCELED:
      return 'Cancelado';
    case ApiService.TvShowStatus.PILOT:
      return 'Pilot';  
    default:
      return status; 
  }
}


export default function TvShowDetailsScreen() {

  const [tvShowData, setTvShowData] = useState(null);
  const route = useRoute();


  useEffect(() => {
    async function getTvShowDetails() {
      try {
        const tvShowDetails = await ApiService.fetchTvShowDetails(route.params.id);
        setTvShowData(tvShowDetails);
      } catch (error) {
        console.error(error);
        // ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    getTvShowDetails();
  }, []);


  function onWatchLaterPress() {
    console.log('TODO: watch later press, id', tvShowData.id);
  }


  return (
    <View style={styles.container}>
      {/* image */}
      <Image
        style={styles.backdropImage}
        source={{uri: ApiService.fetchFullImagePath(tvShowData?.backdrop_path) || ImagePlaceholder.BACKDROP}}
      />
      
      {/* gradient container */}
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#111', '#11111100']}
        start={{x: 0, y: 0.15}} end={{x: 0, y: 0}}
      >
        {/* title */}
        <Text style={styles.title}>
          {tvShowData?.name}
        </Text>
        
        {/* genres */}
        <View>
          <ScrollView horizontal={true}>
            <View style={styles.genresContainer}>
              {tvShowData?.genres.map(genre => (
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
                      {tvShowData?.vote_average.toFixed(1)}
                    </Text>
                    {'/10'}
                  </Text>
                  <Text style={styles.contentText}>{tvShowData?.vote_count}</Text>
                </View>
              </View>

              {/* <TouchableOpacity style={styles.watchLaterButton} onPress={onWatchLaterPress}>
                <FontAwesome name="clock-o" size={20} color="white" />
                <Text style={styles.watchLaterButtonText}>Ver Depois</Text>
              </TouchableOpacity> */}
            </View>

            <View style={{marginHorizontal: 10}}>
              <Text style={styles.contentText}>
                Criado por: {tvShowData?.created_by
                  .map(creator => creator.name)
                  .slice(0, 3)
                  .join(', ')}
              </Text>
              <Text style={[styles.contentText, {marginBottom: 20}]}>
                Elenco: {tvShowData?.credits.cast
                  .map(actor => actor.name)
                  .slice(0, 3)
                  .join(', ')}
              </Text>
              {tvShowData?.overview && (
                <Text style={[styles.contentText, {marginBottom: 20}]}>
                  {tvShowData.overview}
                </Text>
              )}
              <Text style={styles.contentText}>
                Título Original: {tvShowData?.original_name}
              </Text>
              <Text style={styles.contentText}>
                Status: {tvShowData?.status && formatTvShowStatus(tvShowData.status)}
              </Text>
              <Text style={styles.contentText}>
                Temporadas: {tvShowData?.seasons.filter(tvShow => tvShow.name !== 'Especiais').length}
              </Text>
              <Text style={styles.contentText}>
                Primeira Transmissão: {tvShowData?.first_air_date &&
                  new Intl.DateTimeFormat('pt-BR').format(new Date(tvShowData.first_air_date))}
              </Text>
              <Text style={styles.contentText}>
                Última Transmissão: {tvShowData?.last_air_date &&
                  new Intl.DateTimeFormat('pt-BR').format(new Date(tvShowData.last_air_date))}
              </Text>
            </View>

            {tvShowData?.recommendations.total_results > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Recomendações
                </Text>
                <RowTvShowList
                  tvShowsData={tvShowData.recommendations.results}
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