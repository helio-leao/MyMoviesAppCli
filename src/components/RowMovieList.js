import { StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { ImagePlaceholder } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';


export default function RowMovieList({contentContainerStyle, moviesData}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    navigation.push('MovieDetailsScreen', {id: item.id});
  }


  return (
    <FlatList
      horizontal
      keyExtractor={item => String(item.id)}
      contentContainerStyle={contentContainerStyle}
      data={moviesData}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => handleCardPress(item)}
        >
          <Image
            style={styles.poster}
            source={item?.poster_path ?
              {uri: ApiService.fetchFullImagePath(item.poster_path)}
              : ImagePlaceholder.POSTER
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
