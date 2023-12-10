import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import LoadableImage from './LoadableImage';


export default function SearchResultCard({mediaData}) {

  const navigation = useNavigation();


  function handleCardPress() {
    const {id: mediaId, media_type: mediaType} = mediaData;
    navigation.push('MediaDetailsScreen', {mediaId, mediaType});
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
        {/* TODO: improve this??? */}
        {(mediaData.first_air_date || mediaData.release_date) && (
          <Text style={styles.resultCardText}>
            {new Intl.DateTimeFormat('pt-BR').format(new Date(mediaData.first_air_date || mediaData.release_date))}
          </Text>
        )}
        <Text style={styles.resultCardText}>
          {mediaData.media_type}
        </Text>
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
  },
});