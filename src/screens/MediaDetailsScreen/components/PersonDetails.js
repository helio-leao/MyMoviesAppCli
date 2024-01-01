import { ScrollView, StyleSheet, Text, View, ToastAndroid, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import ApiService from '../../../services/ApiService';
import placeholder_poster from '../../../assets/images/placeholder_poster.png';
import FollowedPeopleStorageService from '../../../services/FollowedPeopleStorageService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MediaRowList from '../../../components/MediaRowList';
import { SessionContext } from '../../../contexts/SessionContext';
import CollapsibleText from '../../../components/CollapsibleText';
import LoadableImage from '../../../components/LoadableImage';


export default function PersonDetails({personId}) {

  const {session} = useContext(SessionContext);
  const [personDetails, setPersonDetails] = useState(null);
  const [isPersonFollowed, setIsPersonFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function loadPersonData() {
      try {
        const personDetails = await ApiService.fetchPersonDetails(personId);
        setPersonDetails(personDetails);

        if(session) {
          const personFollowed = await FollowedPeopleStorageService
            .getFollowedPerson(session.user.id, personDetails.id);
  
          if(personFollowed) {
            setIsPersonFollowed(true);
          } else {
            setIsPersonFollowed(false);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadPersonData();
  }, []);


  async function handleFollowPress() {
    const {id, name, profile_path} = personDetails;

    try {
      await FollowedPeopleStorageService
        .addFollowedPerson(session.user.id, { id, name, profile_path });

      setIsPersonFollowed(true);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(`Ocorreu um erro.`, ToastAndroid.SHORT);
    }
  }

  async function handleUnfollowPress() {
    try {
      await FollowedPeopleStorageService
        .removeFollowedPerson(session.user.id, personDetails.id);
      setIsPersonFollowed(false);
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  function compareVoteCount(a, b) {
    return b.vote_count - a.vote_count;
  }

  function getAge() {
    const now = new Date();
    const birthdate = new Date(personDetails.birthday);
    const age = now.getFullYear() - birthdate.getFullYear();
    const currentMonth = now.getMonth();
    const birthMonth = birthdate.getMonth();

    if (birthMonth > currentMonth ||
      (birthMonth === currentMonth && now.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
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
            source={{uri: ApiService.fetchFullImagePath(personDetails.profile_path)}}
            placeholder={placeholder_poster}
          />

          <View style={styles.headerCardData}>
            <Text style={styles.title}>{personDetails.name}</Text>
            <Text style={styles.text}>{personDetails.place_of_birth}</Text>
            <Text style={styles.text}>
              {new Intl.DateTimeFormat('pt-BR').format(
                new Date(personDetails.birthday))} ({getAge()} anos)
            </Text>
            <Text style={[styles.subtitle, {color: '#888'}]}>
              {personDetails.known_for_department}
            </Text>

            {session && (
              isPersonFollowed ? (
                <TouchableOpacity style={styles.button} onPress={handleUnfollowPress}>
                  <FontAwesome name="user-times" size={16} color="white" />
                  <Text style={{color: '#fff'}}>Unfollow</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleFollowPress}>
                  <FontAwesome name="user-plus" size={16} color="white" />
                  <Text style={{color: '#fff'}}>Follow</Text>
                </TouchableOpacity>
              )
            )}
          </View>

        </View>

        {personDetails.biography && (
          <View style={styles.body}>
            <Text style={styles.subtitle}>Biografia</Text>
            <CollapsibleText
              textStyle={styles.text}
              numberOfLines={8}
            >
              {personDetails.biography}
            </CollapsibleText>
          </View>
        )}

        {/* TODO: refactor this code repetition */}
        <View style={styles.creditsContainer}>
          {personDetails.known_for_department === ApiService.Department.ACTING ? (
            <>
              {personDetails.combined_credits.cast.length > 0 && (
                <View>
                  <Text style={[styles.subtitle, {marginLeft: 10}]}>
                    Atuação
                  </Text>
                  <MediaRowList
                    mediaDataList={personDetails.combined_credits
                      .cast.sort(compareVoteCount)}
                    contentContainerStyle={{paddingHorizontal: 10}}
                  />
                </View>  
              )}

              {personDetails.combined_credits.crew.length > 0 && (
                <View>
                  <Text style={[styles.subtitle, {marginLeft: 10}]}>
                    Produção
                  </Text>
                  <MediaRowList
                    mediaDataList={personDetails.combined_credits
                      .crew.sort(compareVoteCount)}
                    contentContainerStyle={{paddingHorizontal: 10}}
                  />
                </View>  
              )}
            </>
          ) : (
            <>
              {personDetails.combined_credits.crew.length > 0 && (
                <View>
                  <Text style={[styles.subtitle, {marginLeft: 10}]}>
                    Produção
                  </Text>
                  <MediaRowList
                    mediaDataList={personDetails.combined_credits
                      .crew.sort(compareVoteCount)}
                    contentContainerStyle={{paddingHorizontal: 10}}
                  />
                </View>  
              )}

              {personDetails.combined_credits.cast.length > 0 && (
                <View>
                  <Text style={[styles.subtitle, {marginLeft: 10}]}>
                    Atuação
                  </Text>
                  <MediaRowList
                    mediaDataList={personDetails.combined_credits
                      .cast.sort(compareVoteCount)}
                    contentContainerStyle={{paddingHorizontal: 10}}
                  />
                </View>  
              )}
            </>
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
    marginBottom: 10,
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
  },
  button: {
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