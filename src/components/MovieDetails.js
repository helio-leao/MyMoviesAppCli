import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
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
    <MediaDetails mediaDetails={movieDetails} />
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
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
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