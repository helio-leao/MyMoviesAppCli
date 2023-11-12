import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import RowMovieList from '../components/RowMovieList';


export default function PersonDetailsScreen() {

  const [personData, setPersonData] = useState(null);
  const route = useRoute();


  useEffect(() => {
    async function loadPersonData() {
      try {
        const personDetails = await ApiService.fetchPersonDetails(route.params.id);
        setPersonData(personDetails);
      } catch (error) {
        console.error(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
    loadPersonData();
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.header}>
          <Image
            style={styles.personImage}
            source={personData?.profile_path ?
              {uri: ApiService.fetchFullImagePath(personData.profile_path)}
              : placeholder_poster
            }
          />

          <View style={styles.headerCardData}>
            <Text style={styles.title}>{personData?.name}</Text>
            <Text style={styles.subtitle}>{personData?.known_for_department}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.subtitle}>Biografia</Text>
          <Text style={styles.text}>{personData?.biography}</Text>
        </View>

        {/* NOTE: the crew array comes with movie repetition for each of the */}
        {/* person's department in the movie. e.g. writing, camera, directing */}
        {personData?.known_for_department === 'Acting' ? (
          <View style={{marginBottom: 20}}>
            <Text style={[styles.subtitle, {marginLeft: 10}]}>
              Acting
            </Text>
            <RowMovieList
              moviesData={personData?.movie_credits.cast}
              contentContainerStyle={{paddingHorizontal: 10}}
            />
          </View>
        ) : (
          // ISSUE: still bringing duplicates
          <View style={{marginBottom: 20}}>
            <Text style={[styles.subtitle, {marginLeft: 10}]}>
              {personData?.known_for_department}
            </Text>
            <RowMovieList
              moviesData={personData?.movie_credits.crew
                .filter(movie => movie.department === personData.known_for_department)}
              contentContainerStyle={{paddingHorizontal: 10}}
            />
          </View>
        )}

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
});