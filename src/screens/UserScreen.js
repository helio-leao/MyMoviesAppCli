import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, Image } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../contexts/SessionContext';
import placeholder_avatar from '../assets/images/placeholder_avatar.jpg';


export default function UserScreen() {

  const {session, deleteSession} = useContext(SessionContext);
  const navigation = useNavigation();
  const {user} = session;


  async function handleLogoutPress() {
    try {
      const response = await ApiService.deleteSession(session.id);

      if(response.success) {
        navigation.navigate('HomeTab');
        await deleteSession();
        ToastAndroid.show('Logged out.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  function handleFavoritesPress() {
    navigation.navigate('FavoritesScreen');
  }

  function handleFollowingPress() {
    navigation.navigate('FollowingScreen');
  }


  return (
    <View style={styles.container}>

      <View style={styles.userDataContainer}>
        <Image
          style={styles.avatar}
          source={user.avatar.tmdb.avatar_path ?
            {uri: ApiService.fetchFullImagePath(user.avatar.tmdb.avatar_path)}
            : placeholder_avatar
          }
        />

        <View style={{flex: 1}}>
          {user.name && (
            <Text style={{color: '#fff', fontSize: 20}}>
              {user.name}
            </Text>
          )}
          <Text style={{color: '#fff', fontSize: 20, marginBottom: 14}}>
            {user.username}
          </Text>

          <TouchableOpacity
            style={[styles.button, {
              alignSelf: 'flex-start',
              paddingHorizontal: 14,
              paddingVertical: 6,
            }]}
            onPress={handleLogoutPress}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{gap: 10}}>
        <TouchableOpacity style={styles.button} onPress={handleFavoritesPress}>
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFollowingPress}>
          <Text style={styles.buttonText}>Seguindo</Text>
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
    marginBottom: 20,
    flexDirection: 'row',
    gap: 20,
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 75,
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
});