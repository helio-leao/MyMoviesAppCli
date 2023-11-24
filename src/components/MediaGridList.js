import { StyleSheet, TouchableOpacity, FlatList, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import LoadableImage from './LoadableImage';


export default function MediaGridList({
  mediaData,
  onEndReached = () => {},
  showLoadingMoreIndicator = false,
  numColumns = 3,
  mediaType,
}) {
  const navigation = useNavigation();

  function onCardPress(id) {
    navigation.push('MediaDetailsScreen', {id, mediaType});
  }


  return (
    <FlatList
      data={mediaData}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles(numColumns).cardContainer}
          onPress={() => onCardPress(item.id)}
        >
          <LoadableImage
            style={styles().cardPoster}
            source={{uri: ApiService.fetchFullImagePath(item.poster_path)}}
            placeholder={placeholder_poster}
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
    width: '100%',
    height: undefined,
  },
  footerIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});