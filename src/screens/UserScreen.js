import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../contexts/SessionContext';


export default function UserScreen() {

  const {session, handleLogout} = useContext(SessionContext);
  const navigation = useNavigation();


  async function handleLogoutPress() {
    try {
      const response = await ApiService.deleteSession(session.id);

      if(response.success) {
        navigation.navigate('HomeTab');
        await handleLogout();
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

      <View style={{marginBottom: 20}}>
        <Text style={{color: '#fff'}}>{JSON.stringify(session.user, null, 2)}</Text>
      </View>

      <View style={{gap: 10}}>
        <TouchableOpacity style={styles.button} onPress={handleFavoritesPress}>
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFollowingPress}>
          <Text style={styles.buttonText}>Seguindo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Logout</Text>
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