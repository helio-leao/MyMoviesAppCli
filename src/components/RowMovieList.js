import { StyleSheet, FlatList, TouchableOpacity, View, Image } from 'react-native';
import { IMAGES } from '../constants/images';
import { getFullImagePath } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { MEDIA_TYPE } from '../services/apiService';

// TODO: change component name (actually being used by movies and tv shows)

export default function RowMovieList({contentContainerStyle, moviesData}) {

  const navigation = useNavigation();


  function handleCardPress(item) {
    switch (item.media_type) {
      case MEDIA_TYPE.MOVIE:
        navigation.push('MovieDetailsScreen', {id: item.id});        
        break;        
      case MEDIA_TYPE.TV:
        navigation.push('TvShowDetailsScreen', {id: item.id});
        break;
    }
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
            source={{uri: getFullImagePath(item.poster_path) || IMAGES.posterPlaceholder}} 
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
