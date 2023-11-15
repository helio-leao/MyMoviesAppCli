import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function SearchResultCard({item}) {

  const navigation = useNavigation();


  function handleCardPress() {
    const {id, media_type: mediaType} = item;

    switch(mediaType) {
      case ApiService.MediaType.MOVIE:
      case ApiService.MediaType.TV:
        navigation.push('MediaDetailsScreen', {id, mediaType});
        break;
      case ApiService.MediaType.PERSON:
        navigation.push('PersonDetailsScreen', {id});    
        break;
      default:
        console.warn('Media type not recognized:', mediaType);
    }
  }

  
  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      {item.media_type === ApiService.MediaType.PERSON ? (
        <Image
          style={styles.resultCardImage}
          source={item.profile_path ?
            {uri: ApiService.fetchFullImagePath(item.profile_path)}
            : placeholder_poster
          }
        />
      ) : (
        <Image
          style={styles.resultCardImage}
          source={item.poster_path ?
            {uri: ApiService.fetchFullImagePath(item.poster_path)}
            : placeholder_poster
          }
        />
      )}

      {/* data container */}
      {item.media_type === ApiService.MediaType.MOVIE ? (
        <View style={styles.resultCardDataContainer}>
          <Text style={styles.resultCardTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      ) : (
        <View style={styles.resultCardDataContainer}>
          <Text style={styles.resultCardTitle} numberOfLines={2}>
            {item.name}
          </Text>
        </View> 
      )}
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