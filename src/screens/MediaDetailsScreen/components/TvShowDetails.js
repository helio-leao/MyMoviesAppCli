import { StyleSheet, Text, View, ToastAndroid, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import CollapsibleText from '../../../components/CollapsibleText';
import MediaDetails from './MediaDetails';
import { SessionContext } from '../../../contexts/SessionContext';

// TODO: change some setTvShowDetails to fetching the updated tv data would be
// the correct behaviour instead of changing data just for speed.


export default function TvShowDetails({tvShowId}) {

  const {session} = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(true);
  const [tvShowDetails, setTvShowDetails] = useState(null);


  useEffect(() => {
    async function loadTvShowDetails() {
      try {
        const tvShowDetails = await ApiService.fetchTvShowDetails(tvShowId, session?.id);
        setTvShowDetails(tvShowDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadTvShowDetails();
  }, []);


  async function onFavoriteButtonPress() {
    try {
      const favoriteAction = tvShowDetails.account_states.favorite
        ? ApiService.removeFavorite
        : ApiService.addFavorite;

      const response = await favoriteAction(
        session.user.id,
        session.id,
        tvShowDetails,
      );

      if(response.success) {
        setTvShowDetails(prev => ({
          ...prev,
          account_states: {
            ...prev.account_states,
            favorite: !prev.account_states.favorite,
          }
        }))
      }
    } catch (error) {
      console.log('Error response:', error.response.data);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleTvShowRate(rating) {
    try {
      const response = await ApiService.addTvShowRating(
        tvShowDetails.id,
        session.id,
        rating,
      );

      if(response.success) {
        setTvShowDetails(prev => ({
          ...prev,
          account_states: {
            ...prev.account_states,
            rated: {
              value: rating,
            },
          }
        }))
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleDeleteTvShowRate() {
    try {
      const response = await ApiService.deleteTvShowRating(
        tvShowDetails.id,
        session.id,
      );

      if(response.success) {
        setTvShowDetails(prev => ({
          ...prev,
          account_states: {
            ...prev.account_states,
            rated: false,
          }
        }))
      }
    } catch (error) {
      console.error(error);
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

  if(session) {
    return (
      <MediaDetails
        mediaDetails={tvShowDetails}
        bodyContent={<MediaContent mediaData={tvShowDetails} />}
        onFavoriteButtonPress={onFavoriteButtonPress}
        onRate={handleTvShowRate}
        onDeleteRating={handleDeleteTvShowRate}
      />
    );
  } else {
    return (
      <MediaDetails
        mediaDetails={tvShowDetails}
        bodyContent={<MediaContent mediaData={tvShowDetails} />}
      />
    );
  }
}


function MediaContent({mediaData}) {

  return(
    <View style={styles.contentContainer}>
      {mediaData.created_by.length > 0 && (
        <Text style={styles.contentText}>
          Criado por: {mediaData.created_by
            .slice(0, 3)
            .map(creator => creator.name)
            .join(', ')}
        </Text>
      )}
      <Text style={[styles.contentText, {marginBottom: 20}]}>
        Elenco: {mediaData.credits.cast
          .slice(0, 3)
          .map(actor => actor.name)
          .join(', ')}
      </Text>
      {mediaData.overview && (
        <CollapsibleText
          contentContainerStyle={{marginBottom: 20}}
          numberOfLines={8}
          textStyle={styles.contentText}
        >
          {mediaData.overview}
        </CollapsibleText>
      )}
      <Text style={styles.contentText}>
        Título Original: {mediaData.original_name}
      </Text>
      <Text style={styles.contentText}>
        Status: {mediaData.status}
      </Text>
      {/* TODO: show only the number of main seasons */}
      {console.log(mediaData.seasons)}
      <Text style={styles.contentText}>
        Temporadas: {mediaData.seasons.length}
      </Text>
      {mediaData.first_air_date && (
        <Text style={styles.contentText}>
          Primeira Transmissão: {mediaData.first_air_date &&
            new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.first_air_date))}
        </Text>
      )}
      {mediaData.last_air_date && (
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