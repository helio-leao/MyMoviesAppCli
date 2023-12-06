import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import StorageService from '../services/FollowedPeopleStorageService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MediaRowList from './MediaRowList';
import { SessionContext } from '../contexts/SessionContext';
import CollapsibleText from './CollapsibleText';
import LoadableImage from './LoadableImage';


export default function PersonDetails({personId}) {

  const {session} = useContext(SessionContext);
  const [personData, setPersonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadPersonData() {
      try {
        const personDetails = await ApiService.fetchPersonDetails(personId);
        setPersonData(personDetails);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadPersonData();
  }, []);


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

          <LoadableImage
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
          </View>
        )}

        <View style={styles.creditsContainer}>
          {personData?.combined_credits.cast.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Atuação
              </Text>
              <MediaRowList
                mediaData={personData.combined_credits.cast}
                contentContainerStyle={{paddingHorizontal: 10}}
              />
            </View>  
          )}

          {personData?.combined_credits.crew.length > 0 && (
            <View>
              <Text style={[styles.subtitle, {marginLeft: 10}]}>
                Produção
              </Text>
              <MediaRowList
                mediaData={personData.combined_credits.crew}
                contentContainerStyle={{paddingHorizontal: 10}}
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
    marginRight: 20,
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