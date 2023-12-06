import { StyleSheet, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import MediaCard from './MediaCard';


export default function MediaRowList({contentContainerStyle, mediaData}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    const mediaType = ApiService.fetchMediaType(item);
    const {id} = item;

    navigation.push('MediaDetailsScreen', {id, mediaType});
  }

  function keyExtractor(item) {
    const stringId = String(item.id);

    if(item.character) {  // cast person
      return stringId + '-' + item.character;
    } else if(item.job) { // crew person
      return stringId + '-' + item.job;
    } else {  // movies, tv, others
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
          onPress={() => handleCardPress(item)}
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