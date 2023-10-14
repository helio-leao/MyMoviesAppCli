import { StyleSheet, TouchableOpacity, FlatList, View, ActivityIndicator, Image } from 'react-native';
import { getFullImagePath } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { ImagePlaceholder } from '../constants/images';
import { Screen } from '../routes/RootTabNavigator';


export default function GridMovieList({
  moviesData,
  onEndReached,
  showLoadingMoreIndicator = false,
  numColumns = 3,
}) {
  const navigation = useNavigation();

  function onCardPress(id) {
    navigation.push(Screen.MOVIE_DETAILS, {id});
  }  

  return (
    <FlatList
      data={moviesData}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles(numColumns).cardContainer}
          onPress={() => onCardPress(item.id)}
        >
          <Image
            style={styles().cardPoster}
            source={{uri: getFullImagePath(item.poster_path) || ImagePlaceholder.POSTER}}
          />
        </TouchableOpacity>
      )}
      numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      ListFooterComponent={showLoadingMoreIndicator && (
        <View style={styles().footerIndicatorContainer}>
          <ActivityIndicator color={'white'} size={'large'} />
        </View>
      )}
    />
  );
}

const styles = (numColumns) => StyleSheet.create({
  cardContainer: {
    flex: 1/numColumns,
  },
  cardPoster: {
    aspectRatio: 2/3,
  },
  footerIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
