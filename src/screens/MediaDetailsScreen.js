import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import MediaRowList from '../components/MediaRowList';
import { SessionContext } from '../contexts/SessionContext';
import CollapsibleText from '../components/CollapsibleText';
import LoadableImage from '../components/LoadableImage';

// TODO: filter crew by most relevant(artistic) jobs like directing, writing...?
// TODO: change some margins, use views with gaps. i.e. creditsContainer


export default function MediaDetailsScreen() {

  const {session} = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaData, setMediaData] = useState(null);
  const route = useRoute();
  const {mediaType} = route.params;


  useEffect(() => {
    async function loadMediaData() {
      const {id} = route.params;

      try {
        switch(mediaType) {
          case ApiService.MediaType.MOVIE:
            const movieDetails = await ApiService.fetchMovieDetails(id);
            setMediaData(movieDetails);
            break;
          case ApiService.MediaType.TV:
            const tvShowDetails = await ApiService.fetchTvShowDetails(id);
            setMediaData(tvShowDetails);
            break;
          default:
            console.warn('Media type invalid:', mediaType);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadMediaData();
  }, []);


  async function onFavoritePress() {
    try {
      const response = await ApiService.addFavorite(
        session.user.id,
        session.id,
        mediaData,
        mediaType,
      );

      if(response.success) {
        ToastAndroid.show('Operação bem sucedida.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('error response: ', error.response.data);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  if(isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator color={'white'} size={'large'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* image */}
      <LoadableImage
        style={styles.backdropImage}
        source={{uri: ApiService.fetchFullImagePath(mediaData?.backdrop_path)}}
        placeholder={placeholder_poster}
      />
      
      {/* gradient container */}
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#111', '#11111100']}
        start={{x: 0, y: 0.15}} end={{x: 0, y: 0}}
      >
        {/* title for movies or name for tv */}
        <Text style={styles.title} numberOfLines={2}>
          {mediaData?.title || mediaData?.name}
        </Text>
        
        {/* genres */}
        <View>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <View style={styles.genresContainer}>
              {mediaData?.genres.map(genre => (
                <View key={genre.id} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <ScrollView>
          <View style={styles.contentScrollContainer}>

            {/* ratings and favorite button */}
            <View style={styles.ratingsAndFavoriteContainer}>
              <View style={styles.ratingsContainer}>
                <Fontisto name="star" size={30} color="yellow" />

                <View>
                  {/* NOTE: good way to use text with multiple styles */}
                  <Text style={{color: '#fff'}}>
                    <Text style={{fontSize: 20, fontWeight: '800'}}>
                      {mediaData?.vote_average.toFixed(1)}
                    </Text>
                    <Text style={{fontSize: 18}}>
                      /10
                    </Text>
                  </Text>

                  <Text style={styles.contentText}>{mediaData?.vote_count}</Text>
                </View>
              </View>

              {session?.user && (
                <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                  <FontAwesome name="heart" size={20} color="white" />
                  <Text style={styles.favoriteButtonText}>Favoritar</Text>
                </TouchableOpacity>
              )}
            </View>

            <MediaContent mediaData={mediaData} />

            {mediaData?.recommendations.total_results > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Recomendações
                </Text>
                <MediaRowList
                  mediaData={mediaData.recommendations.results}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

            {mediaData?.credits.cast.length > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Elenco
                </Text>
                <MediaRowList
                  mediaData={mediaData.credits.cast}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

            {mediaData?.credits.crew.length > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Produção
                </Text>
                <MediaRowList
                  mediaData={mediaData.credits.crew}
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


function MediaContent({mediaData}) {
  const mediaType = ApiService.fetchMediaType(mediaData);

  switch(mediaType) {
    case ApiService.MediaType.MOVIE:
      return <MovieContent mediaData={mediaData} />
    case ApiService.MediaType.TV:
      return <TvShowContent mediaData={mediaData} />
    default:
      console.warn('Media type invalid:', mediaType);
      return null;
  }
}

function MovieContent({mediaData}) {
  return(
    <View style={styles.contentContainer}>
      <Text style={styles.contentText}>
        Direção: {mediaData?.credits.crew
          .filter(person => person.job === ApiService.CrewJob.DIRECTOR)
          .map(director => director.name)
          .slice(0, 3)
          .join(', ')}
      </Text>
      <Text style={styles.contentText}>
        Roteiro: {mediaData?.credits.crew
          .filter(person => person.job === ApiService.CrewJob.SCREENPLAY ||
            person.job === ApiService.CrewJob.WRITER || person.job === ApiService.CrewJob.AUTHOR)
          .map(writer => writer.name)
          .slice(0, 3)
          .join(', ')}
      </Text>
      <Text style={[styles.contentText, {marginBottom: 20}]}>
            Elenco: {mediaData?.credits.cast
          .map(actor => actor.name)
          .slice(0, 3)
          .join(', ')}
      </Text>
      {mediaData?.overview && (
        <CollapsibleText
          contentContainerStyle={{marginBottom: 20}}
          numberOfLines={8}
          textStyle={styles.contentText}
        >
          {mediaData.overview}
        </CollapsibleText>
      )}
      <Text style={styles.contentText}>
        Título Original: {mediaData?.original_title}
      </Text>
      <Text style={styles.contentText}>
        Lançamento: {mediaData?.release_date &&
          new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.release_date))}
      </Text>
    </View>
  );
}

function TvShowContent({mediaData}) {

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

  return(
    <View style={styles.contentContainer}>
      {mediaData?.created_by.length > 0 && (
        <Text style={styles.contentText}>
          Criado por: {mediaData.created_by
            .map(creator => creator.name)
            .slice(0, 3)
            .join(', ')}
        </Text>
      )}
      <Text style={[styles.contentText, {marginBottom: 20}]}>
        Elenco: {mediaData?.credits.cast
          .map(actor => actor.name)
          .slice(0, 3)
          .join(', ')}
      </Text>
      {mediaData?.overview && (
        <Text style={[styles.contentText, {marginBottom: 20}]}>
          {mediaData.overview}
        </Text>
      )}
      <Text style={styles.contentText}>
        Título Original: {mediaData?.original_name}
      </Text>
      <Text style={styles.contentText}>
        Status: {mediaData?.status && formatTvShowStatus(mediaData.status)}
      </Text>
      <Text style={styles.contentText}>
        Temporadas: {mediaData?.seasons.filter(tvShow => tvShow.name !== 'Especiais').length}
      </Text>
      {mediaData?.first_air_date && (
        <Text style={styles.contentText}>
          Primeira Transmissão: {mediaData.first_air_date &&
            new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.first_air_date))}
        </Text>
      )}
      {mediaData?.last_air_date && (
        <Text style={styles.contentText}>
          Última Transmissão: {mediaData.last_air_date &&
            new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.last_air_date))}
        </Text>
      )}
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
  ratingsAndFavoriteContainer: {
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
  favoriteButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainer: {
    marginHorizontal: 10,
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