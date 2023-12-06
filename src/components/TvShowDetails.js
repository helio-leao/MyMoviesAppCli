import { StyleSheet, Text, View, ToastAndroid, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import CollapsibleText from '../components/CollapsibleText';
import MediaDetails from './MediaDetails';


export default function TvShowDetails({tvShowId}) {

  const [isLoading, setIsLoading] = useState(true);
  const [tvShowDetails, setTvShowDetails] = useState(null);


  useEffect(() => {
    async function loadTvShowDetails() {
      try {
        const tvShowDetails = await ApiService.fetchTvShowDetails(tvShowId);
        setTvShowDetails(tvShowDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadTvShowDetails();
  }, []);


  if(isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator color={'white'} size={'large'} />
      </View>
    );
  }

  return (
    <MediaDetails
      mediaDetails={tvShowDetails}
      mediaContent={() => <MediaContent mediaData={tvShowDetails} />}
    />
  );
}

function MediaContent({mediaData}) {

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
            .slice(0, 3)
            .map(creator => creator.name)
            .join(', ')}
        </Text>
      )}
      <Text style={[styles.contentText, {marginBottom: 20}]}>
        Elenco: {mediaData?.credits.cast
          .slice(0, 3)
          .map(actor => actor.name)
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
  contentContainer: {
    marginHorizontal: 10,
  },
  contentText: {
    fontSize: 18,
    color: '#fff',
  },
});