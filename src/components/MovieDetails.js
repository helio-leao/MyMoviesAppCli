import { StyleSheet, Text, View, ToastAndroid, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import CollapsibleText from '../components/CollapsibleText';
import MediaDetails from './MediaDetails';


export default function MovieDetails({movieId}) {

  const [isLoading, setIsLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);


  useEffect(() => {
    async function loadMovieDetails() {
      try {
        const movieDetails = await ApiService.fetchMovieDetails(movieId);
        setMovieDetails(movieDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadMovieDetails();
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
      mediaDetails={movieDetails}
      mediaContent={<MediaContent mediaData={movieDetails} />}
    />
  );
}

function MediaContent({mediaData}) {
  return(
    <View style={styles.contentContainer}>
      <Text style={styles.contentText}>
        Direção: {mediaData?.credits.crew
          .filter(person => person.job === ApiService.CrewJob.DIRECTOR)
          .slice(0, 3)
          .map(director => director.name)
          .join(', ')}
      </Text>
      <Text style={styles.contentText}>
        Roteiro: {mediaData?.credits.crew
          .filter(person => person.job === ApiService.CrewJob.SCREENPLAY ||
            person.job === ApiService.CrewJob.WRITER ||
            person.job === ApiService.CrewJob.AUTHOR ||
            person.job === ApiService.CrewJob.THEATRE_PLAY ||
            person.job === ApiService.CrewJob.NOVEL)
          .slice(0, 3)
          .map(writer => writer.name)
          .join(', ')}
      </Text>
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
        Título Original: {mediaData?.original_title}
      </Text>
      <Text style={styles.contentText}>
        Lançamento: {mediaData?.release_date &&
          new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.release_date))}
      </Text>
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