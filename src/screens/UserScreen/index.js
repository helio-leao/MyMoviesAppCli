import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, Alert } from 'react-native';
import ApiService from '../../services/ApiService';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../../contexts/SessionContext';
import placeholder_avatar from '../../assets/images/placeholder_avatar.jpg';
import LoadableImage from '../../components/LoadableImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function UserScreen() {

  const {session, deleteSession} = useContext(SessionContext);
  const navigation = useNavigation();
  const {user} = session;


  function handleLogoutPress() {
    Alert.alert(
      'Atenção',
      'Confirma o logout?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {text: 'Sim', onPress: logout},
      ],
      {cancelable: true},
    );

    async function logout() {
      try {
        const response = await ApiService.deleteSession(session.id);
  
        if(response.success) {
          navigation.navigate('HomeTab');
          await deleteSession();
        }
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }
  }

  function handleFavoritesPress() {
    navigation.navigate('FavoritesScreen');
  }

  function handleFollowingPress() {
    navigation.navigate('FollowingScreen');
  }

  function handleRatedPress() {
    navigation.navigate('RatedMediaScreen');
  }


  return (
    <View style={styles.container}>

      <View style={styles.userDataContainer}>
        <View>
          <LoadableImage
            style={styles.avatar}
            source={{uri: ApiService.fetchFullImagePath(user.avatar.tmdb.avatar_path)}}
            placeholder={placeholder_avatar}
          />

          <TouchableOpacity style={styles.signOutButton} onPress={handleLogoutPress}>
            <FontAwesome name="sign-out" size={22} color={'#fff'} />
          </TouchableOpacity>
        </View>

        <View>
          {user.name && (
            <Text style={{color: '#fff', fontSize: 20}}>
              {user.name}
            </Text>
          )}
          <Text style={{color: '#fff', fontSize: 20, marginBottom: 14}}>
            {user.username}
          </Text>
        </View>
      </View>

      <View style={{gap: 10}}>
        <TouchableOpacity style={styles.button} onPress={handleFavoritesPress}>
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFollowingPress}>
          <Text style={styles.buttonText}>Seguindo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRatedPress}>
          <Text style={styles.buttonText}>Avaliados</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#111',
    padding: 20,
  },
  userDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  buttonText: {
    color: '#000',
    alignSelf: 'center',
  },
  signOutButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#444',
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});