import { StyleSheet, TouchableOpacity, View, Text, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import LoadableImage from './LoadableImage';
import Button from './Button';
import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FollowedPeopleStorageService from '../services/FollowedPeopleStorageService';


export default function SearchResultCard({mediaData}) {

  const {session} = useContext(SessionContext);
  const navigation = useNavigation();


  function handleCardPress() {
    const {id: mediaId, media_type: mediaType} = mediaData;
    navigation.push('MediaDetailsScreen', {mediaId, mediaType});
  }

  async function handleButtonPress() {
    if(mediaData.media_type === ApiService.MediaType.PERSON) {
      await handleFollowPerson();
    } else {
      await handleAddFavorite();
    }
  }

  async function handleFollowPerson() {
    const {id, name, profile_path} = mediaData;

    try {
      await FollowedPeopleStorageService.addFollowedPerson(
        session.user.id, { id, name, profile_path });

      ToastAndroid.show(`Você seguiu ${name}.`, ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  }

  async function handleAddFavorite() {
    try {
      const response = await ApiService.addFavorite(
        session.user.id,
        session.id,
        mediaData,
      );

      if(response.success) {
        ToastAndroid.show(response.status_message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('error response: ', error.response.data);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  
  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* NOTE: poster_path for movies and tv; profile_path for person */}
      <LoadableImage
        style={styles.resultCardImage}
        source={{uri: ApiService.fetchFullImagePath(mediaData.poster_path || mediaData.profile_path)}}
        placeholder={placeholder_poster}
      />

      {/* NOTE: title for movies; name for tv and person */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle} numberOfLines={2}>
          {mediaData.title || mediaData.name}
        </Text>
        <Text style={styles.resultCardText} numberOfLines={2}>
          {mediaData.media_type}
        </Text>
        {/* {session && (
          <Button
            label={mediaData.media_type === ApiService.MediaType.PERSON ?
              'Seguir' : 'Favoritar'}
            icon={mediaData.media_type === ApiService.MediaType.PERSON ? (
              <FontAwesome name="user-plus" size={16} color="white" />
            ) : (
              <FontAwesome name="heart" size={16} color="white" />
            )}
            onPress={handleButtonPress}
          />
        )} */}
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  resultCardContainer: {
    flexDirection: 'row',
  },
  resultCardImage: {
    aspectRatio: 2/3,
    width: 120,
    height: undefined,
    borderRadius: 4,
    marginRight: 20,
  },
  resultCardDataContainer: {
    flex: 1,
  },
  resultCardTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  resultCardText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
});