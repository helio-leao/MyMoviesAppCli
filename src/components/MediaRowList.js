import { StyleSheet, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import MediaCard from './MediaCard';


export default function MediaRowList({contentContainerStyle, mediaData, mediaType}) {

  const navigation = useNavigation();


  function handleCardPress(id) {
    if(mediaType === ApiService.MediaType.PERSON) {
      navigation.push('PersonDetailsScreen', {id});
    } else {
      navigation.push('MediaDetailsScreen', {id, mediaType});
    }
  }

  function keyExtractor(item) {
    const stringId = String(item.id);

    if(item.character) {
      return stringId + item.character;
    } else if(item.job) {
      return stringId + item.job;
    } else {
      return stringId;
    }
  }


  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      data={mediaData}
      renderItem={({item}) => (
        <MediaCard
          style={styles.cardContainer}
          mediaData={item}
          onPress={() => handleCardPress(item.id)}
        />
      )}
      ItemSeparatorComponent={<View style={{width: 20}} />}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 120,
  },
});