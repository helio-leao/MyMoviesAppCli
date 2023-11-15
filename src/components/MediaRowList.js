import { StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function MediaRowList({contentContainerStyle, mediaData, mediaType}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    navigation.push('MediaDetailsScreen', {id: item.id, mediaType});
  }


  return (
    <FlatList
      horizontal
      keyExtractor={item => String(item.id)}
      contentContainerStyle={contentContainerStyle}
      data={mediaData}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => handleCardPress(item)}
        >
          <Image
            style={styles.poster}
            source={item.poster_path ?
              {uri: ApiService.fetchFullImagePath(item.poster_path)}
              : placeholder_poster
            }
          />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={<View style={{width: 20}} />}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 120,
  },
  poster: {
    aspectRatio: 2/3,
    width: '100%',
    height: undefined,
  },
});