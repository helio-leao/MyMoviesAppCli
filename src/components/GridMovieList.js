import { StyleSheet, TouchableOpacity, FlatList, View, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImagePlaceholder } from '../utils/constants';
import ApiService from '../services/ApiService';


export default function GridMovieList({
  moviesData,
  onEndReached,
  showLoadingMoreIndicator = false,
  numColumns = 3,
}) {
  const navigation = useNavigation();

  function onCardPress(id) {
    navigation.push('MovieDetailsScreen', {id});
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
            source={{uri: ApiService.fetchFullImagePath(item.poster_path) || ImagePlaceholder.POSTER}}
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
