import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MediaCard from './MediaCard';
import ApiService from '../services/ApiService';


export default function MediaGridList({
  mediaData,
  onEndReached = () => {},
  showLoadingMoreIndicator = false,
  numColumns = 3,
}) {
  const navigation = useNavigation();
  

  function handleCardPress(item) {
    const mediaType = ApiService.fetchMediaType(item);
    const {id} = item;

    if(mediaType === ApiService.MediaType.PERSON) {
      navigation.push('PersonDetailsScreen', {id});
    } else {
      navigation.push('MediaDetailsScreen', {id, mediaType});
    }
  }


  return (
    <FlatList
      data={mediaData}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => (
        <MediaCard
          style={[styles(numColumns).cardContainer, {margin: 2}]}
          mediaData={item}
          onPress={() => handleCardPress(item)}
        />
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
  footerIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});