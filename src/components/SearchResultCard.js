import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import LoadableImage from './LoadableImage';


export default function SearchResultCard({item}) {

  const navigation = useNavigation();


  function handleCardPress() {
    const {id, media_type: mediaType} = item;
    navigation.push('MediaDetailsScreen', {id, mediaType});
  }

  
  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* NOTE: poster_path for movies and tv; profile_path for person */}
      <LoadableImage
        style={styles.resultCardImage}
        source={{uri: ApiService.fetchFullImagePath(item.poster_path || item.profile_path)}}
        placeholder={placeholder_poster}
      />

      {/* NOTE: title for movies; name for tv and person */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle} numberOfLines={2}>
          {item.title || item.name}
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
    marginBottom: 14,
  },
  resultCardText: {
    fontSize: 18,
    color: '#fff',
  },
});