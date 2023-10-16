import { StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { ImagePlaceholder } from '../utils/constants';
import { getFullImagePath } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';


export default function RowMovieList({contentContainerStyle, moviesData}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    navigation.push('MovieDetailsScreen', {id: item.id});
  }


  return (
    <FlatList
      keyExtractor={item => String(item.id)}
      horizontal={true}
      contentContainerStyle={contentContainerStyle}
      data={moviesData}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => handleCardPress(item)}
        >
          <Image
            style={styles.poster}
            source={{uri: getFullImagePath(item.poster_path) || ImagePlaceholder.POSTER}} 
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
  },
});
