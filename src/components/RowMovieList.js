import { StyleSheet, FlatList, TouchableOpacity, View, Image, Text } from 'react-native';
import { IMAGES } from '../constants/images';
import { getFullImagePath } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';


export default function RowMovieList({contentContainerStyle, moviesData}) {

  const navigation = useNavigation();


  function handleCardPress(id) {
    navigation.push('MovieDetailsScreen', {id});
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
          onPress={() => handleCardPress(item.id)}
        >
          <Image
            style={styles.poster}
            source={{uri: getFullImagePath(item.poster_path) || IMAGES.posterPlaceholder}} 
          />
          {/* <Text style={{color: '#fff'}}>{item.title}</Text> */}
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
