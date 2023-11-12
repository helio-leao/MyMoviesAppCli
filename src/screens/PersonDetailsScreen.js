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


  function toMoviesArrayWithoutDuplicates(moviesData) {
    const sortedItems = [];

    moviesData?.forEach(movieData => {
      let isUnique = true;

      for(let item of sortedItems) {
        if(item.id === movieData.id) {
          isUnique = false;
          break;
        }
      }

      if(isUnique) {
        sortedItems.push(movieData);
      }
    });

    return sortedItems;
  }


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
          // NOTE: the crew array comes with repeated movies for each of the person's department
          // in the it. e.g. writing, camera, directing
          // NOTE: brings only movies in which the department the person worked on is the one
          // that the person is known for
          <View style={{marginBottom: 20}}>
            <Text style={[styles.subtitle, {marginLeft: 10}]}>
              {personData?.known_for_department}
            </Text>
            <RowMovieList
              moviesData={toMoviesArrayWithoutDuplicates(personData?.movie_credits.crew
                .filter(movieData => movieData.department === personData.known_for_department))}
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