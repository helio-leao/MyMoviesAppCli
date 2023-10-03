import { StyleSheet, TouchableOpacity, View, Text, ToastAndroid, Image } from 'react-native';
import { getFullImagePath, MEDIA_TYPE } from '../services/apiService';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as StorageService from './../services/storageService';
import { IMAGES } from '../constants/images';


function TVCard({item}) {

  function handleCardPress() {    
    console.log('TODO: tv card press')
  }

  function handleWatchLaterPress() {
    console.log('TODO: handleWatchLater')
  } 

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={{uri: getFullImagePath(item.poster_path) || IMAGES.posterPlaceholder}} 
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle}>{item.name}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        <TouchableOpacity style={styles.cardButton}  onPress={handleWatchLaterPress}>
          <FontAwesome name="clock-o" size={16} color="white" />
          <Text style={styles.resultCardTextSmall}>Ver depois</Text>
        </TouchableOpacity> 
      </View>      
    </TouchableOpacity>
  )
}

function PersonCard({item}) {

  function handleCardPress() {    
    console.log('TODO: person card press')
  }

  async function handleFollowPress() {
    const {id, name, profile_path} = item;

    try {
      await StorageService.addFollowedPerson({ id, name, profile_path });
      ToastAndroid.show(`Você seguiu ${name}.`, ToastAndroid.SHORT);
    } catch (error) {
      if(StorageService.ERROR.ALREADY_STORED === error.message) {
        console.log(error);
        ToastAndroid.show(`Você já segue ${name}.`, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
      }
    }
  }

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={{uri: getFullImagePath(item.profile_path) || IMAGES.profilePlaceholder}} 
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle}>{item.name}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        <TouchableOpacity style={styles.cardButton} onPress={handleFollowPress}>
          <FontAwesome name="user-plus" size={16} color="white" />
          <Text style={styles.resultCardTextSmall}>Seguir</Text>
        </TouchableOpacity>
      </View>      
    </TouchableOpacity>
  )
}

function MovieCard({item}) {
  const navigation = useNavigation();

  function handleCardPress() {    
    navigation.push('MovieDetailsScreen', {id: item.id});
  }

  function handleWatchLaterPress() {
    console.log('TODO: handleWatchLater')
  }

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={{uri: getFullImagePath(item.poster_path) || IMAGES.posterPlaceholder}}
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle}>{item.title}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        <TouchableOpacity style={styles.cardButton}  onPress={handleWatchLaterPress}>
          <FontAwesome name="clock-o" size={16} color="white" />
          <Text style={styles.resultCardTextSmall}>Ver depois</Text>
        </TouchableOpacity> 
      </View>      
    </TouchableOpacity>
  )
}

export default function SearchResultCard({item}) {
  switch(item.media_type) {
    case MEDIA_TYPE.MOVIE:
      return <MovieCard item={item} />
    case MEDIA_TYPE.TV:
      return <TVCard item={item} />
    case MEDIA_TYPE.PERSON:
      return <PersonCard item={item} />
  }
}

const styles = StyleSheet.create({
  resultCardContainer: {
    flexDirection: 'row',
  },
  resultCardImage: {
    width: 120,
    aspectRatio: 2/3,
    borderRadius: 4,
    marginRight: 10,
  },
  resultCardDataContainer: {
    flex: 1,
  },
  resultCardTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 14,
  },
  resultCardText: {
    fontSize: 18,
    color: '#fff',
  },
  resultCardTextSmall: {
    color: '#fff',
  },
  cardButton: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
});
