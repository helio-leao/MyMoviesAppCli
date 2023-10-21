import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ImagePlaceholder } from '../utils/constants';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';


function TVCard({item}) {
  const navigation = useNavigation();

  function handleCardPress() {    
    navigation.push('TvShowDetailsScreen', {id: item.id});
  }

  function handleWatchLaterPress() {
    console.log('TODO: watch later pressed, id:', item.id)
  } 

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={item.poster_path ?
          {uri: ApiService.fetchFullImagePath(item.poster_path)}
          : ImagePlaceholder.POSTER
        }
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle} numberOfLines={2}>{item.name}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        {/* <TouchableOpacity style={styles.cardButton}  onPress={handleWatchLaterPress}>
          <FontAwesome name="clock-o" size={16} color="white" />
          <Text style={styles.resultCardTextSmall}>Ver depois</Text>
        </TouchableOpacity>  */}
      </View>      
    </TouchableOpacity>
  )
}

function PersonCard({item}) {

  function handleCardPress() {    
    console.log('TODO: card press, person id:', item.id)
  }

  async function handleFollowPress() {
    const {id, name, profile_path} = item;

    try {
      await StorageService.addFollowedPerson({ id, name, profile_path });
        // ToastAndroid.show(`Você seguiu ${name}.`, ToastAndroid.SHORT);
    } catch (error) {
      if(StorageService.Error.ALREADY_STORED === error.message) {
        console.log(error);
        // ToastAndroid.show(`Você já segue ${name}.`, ToastAndroid.SHORT);
      } else {
        // ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
      }
    }
  }

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={item.profile_path ?
          {uri: ApiService.fetchFullImagePath(item.profile_path)}
          : ImagePlaceholder.PROFILE
        }
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle} numberOfLines={2}>{item.name}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        <TouchableOpacity testID={`follow-${item.id}`} style={styles.cardButton} onPress={handleFollowPress}>
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
    console.log('TODO: watch later pressed, id:', item.id)
  }

  return (
    <TouchableOpacity style={styles.resultCardContainer} onPress={handleCardPress}>
      {/* image */}
      <Image
        style={styles.resultCardImage}
        source={item.poster_path ?
          {uri: ApiService.fetchFullImagePath(item.poster_path)}
          : ImagePlaceholder.POSTER
        }
      />

      {/* data container */}
      <View style={styles.resultCardDataContainer}>
        <Text style={styles.resultCardTitle} numberOfLines={2}>{item.title}</Text>
        {/* <Text style={styles.resultCardText}>{item.media_type}</Text> */}

        {/* button */}
        {/* <TouchableOpacity style={styles.cardButton}  onPress={handleWatchLaterPress}>
          <FontAwesome name="clock-o" size={16} color="white" />
          <Text style={styles.resultCardTextSmall}>Ver depois</Text>
        </TouchableOpacity>  */}
      </View>      
    </TouchableOpacity>
  )
}

export default function SearchResultCard({item}) {
  switch(item.media_type) {
    case ApiService.MediaType.MOVIE:
      return <MovieCard item={item} />
    case ApiService.MediaType.TV:
      return <TVCard item={item} />
    case ApiService.MediaType.PERSON:
      return <PersonCard item={item} />
    default:
      return null
  }
}

const styles = StyleSheet.create({
  resultCardContainer: {
    flexDirection: 'row',
  },
  resultCardImage: {
    aspectRatio: 2/3,
    width: 120,
    height: undefined,
    borderRadius: 4,
    marginRight: 20,
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
