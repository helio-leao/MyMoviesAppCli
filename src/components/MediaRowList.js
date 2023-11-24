import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import LoadableImage from './LoadableImage';


export default function MediaRowList({contentContainerStyle, mediaData, mediaType}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    const {id} = item;

    if(mediaType === ApiService.MediaType.PERSON) {
      navigation.push('PersonDetailsScreen', {id});
    } else {
      navigation.push('MediaDetailsScreen', {id, mediaType});
    }
  }


  return (
    <FlatList
      horizontal
      keyExtractor={item => String(item.id)}
      contentContainerStyle={contentContainerStyle}
      data={mediaData}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => handleCardPress(item)}>
          <LoadableImage
            style={styles.poster}
            source={{uri: ApiService.fetchFullImagePath(item.poster_path || item.profile_path)}}
            placeholder={placeholder_poster}
          />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={<View style={{width: 20}} />}
    />
  );
}

const styles = StyleSheet.create({
  poster: {
    aspectRatio: 2/3,
    width: 120,
    height: undefined,
  },
});