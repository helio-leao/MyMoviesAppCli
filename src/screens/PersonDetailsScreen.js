import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import StorageService from '../services/FollowedPeopleStorageService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MediaRowList from '../components/MediaRowList';
import { SessionContext } from '../contexts/SessionContext';
import CollapsibleText from '../components/CollapsibleText';
import CustomImage from '../components/CustomImage';

// NOTE: the cast and crew arrays comes from the api with repeated movies or tv
// for each department the person was involved with. e.g. writing, camera, directing
// the current strategy is to bring all media that the person worked on without
// duplicates. maybe filter by known department or a set of departments and/or jobs.
// probably better by job i.e:
// mediaData={toMediaArrayWithoutDuplicates(personData?.movie_credits.crew
//   .filter(movieData => movieData.department === personData.known_for_department))}


export default function PersonDetailsScreen() {

  const {session} = useContext(SessionContext);
  const [personData, setPersonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();


  useEffect(() => {
    async function loadPersonData() {
      try {
        const personDetails = await ApiService.fetchPersonDetails(route.params.id);
        setPersonData(personDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadPersonData();
  }, []);


  function toMediaArrayWithoutDuplicates(mediaListData) {
    const sortedMedia = [];

    mediaListData?.forEach(mediaData => {
      let isUnique = true;

      for(let item of sortedMedia) {
        if(item.id === mediaData.id) {
          isUnique = false;
          break;
        }
      }

      if(isUnique) {
        sortedMedia.push(mediaData);
      }
    });

    return sortedMedia;
  }

  async function handleFollowPress() {
    const {id, name, profile_path} = personData;

    try {
      const result = await StorageService.addFollowedPerson(session.user.id,
         { id, name, profile_path });

      if(result.success) {
        ToastAndroid.show(`Você seguiu ${name}.`, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
    }
  }


  if(isLoading) {
    return(
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.header}>

          <CustomImage
            style={styles.personImage}
            source={{uri: ApiService.fetchFullImagePath(personData?.profile_path)}}
            placeholder={placeholder_poster}
          />

          <View style={styles.headerCardData}>
            <Text style={styles.title}>{personData?.name}</Text>
            <Text style={styles.subtitle}>{personData?.known_for_department}</Text>

            {session && (
              // TODO: make this button a component to be used at searchcards too
              <TouchableOpacity
                style={{flexDirection: 'row',
                  gap: 6,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: '#333',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  borderRadius: 4,
                }}
                onPress={handleFollowPress}
              >
                <FontAwesome name="user-plus" size={16} color="white" />
                <Text style={{color: '#fff'}}>Seguir</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>

        {personData?.biography && (
          <View style={styles.body}>
            <Text style={styles.subtitle}>Biografia</Text>
            <CollapsibleText
              textStyle={styles.text}
              numberOfLines={8}
            >
              {personData.biography}
            </CollapsibleText>
            {/* <Text style={styles.text}>{personData?.biography}</Text> */}
          </View>
        )}

        <View style={styles.creditsContainer}>
          {personData?.movie_credits.cast.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Filmes (cast)
              </Text>
              <MediaRowList
                mediaData={personData.movie_credits.cast}
                contentContainerStyle={{paddingHorizontal: 10}}
                mediaType={ApiService.MediaType.MOVIE}
              />
            </View>  
          )}

          {personData?.tv_credits.cast.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Séries (cast)
              </Text>
              <MediaRowList
                mediaData={toMediaArrayWithoutDuplicates(personData.tv_credits.cast)}
                contentContainerStyle={{paddingHorizontal: 10}}
                mediaType={ApiService.MediaType.TV}
              />
            </View>
          )}

          {personData?.movie_credits.crew.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Filmes (crew)
              </Text>
              <MediaRowList
                mediaData={toMediaArrayWithoutDuplicates(personData.movie_credits.crew)}
                contentContainerStyle={{paddingHorizontal: 10}}
                mediaType={ApiService.MediaType.MOVIE}
              />
            </View>  
          )}

          {personData?.tv_credits.crew.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Séries (crew)
              </Text>
              <MediaRowList
                mediaData={toMediaArrayWithoutDuplicates(personData.tv_credits.crew)}
                contentContainerStyle={{paddingHorizontal: 10}}
                mediaType={ApiService.MediaType.TV}
              />
            </View>            
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  personImage: {
    aspectRatio: 2/3,
    width: 120,
    height: undefined,
    borderRadius: 4,
    marginRight: 10,
  },
  headerCardData: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 30,
  },
  subtitle: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 10
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  body: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  creditsContainer: {
    marginBottom: 20,
    gap: 20,
  }
});