import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useEffect, useState } from 'react';
import SessionStorageService from '../services/SessionStorageService';
import { SignedUserContext } from '../App';
import { useNavigation } from '@react-navigation/native';


export default function UserScreen() {

  const {signedUser, setSignedUser} = useContext(SignedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    async function loadUserData() {
      // TODO: load user data??
    }
    loadUserData();

    setIsLoading(false);
  }, []);


  async function handleLogout() {
    try {
      const sessionId = await SessionStorageService.getSessionId();
      const response = await ApiService.deleteSession(sessionId);

      if(response.success) {
        navigation.navigate('HomeTab');
        setSignedUser(null);  // NOTE: after navigate so it doesn't mount LoginScreen
        await SessionStorageService.deleteSessionId();
        ToastAndroid.show('Logged out.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  function handleFavoritesPress() {
    console.log('todo: favorites pressed');
  }

  function handleFollowedPeoplePress() {
    console.log('todo: followed people pressed');
  }


  if(isLoading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View> 
    );
  }

  return (
    <View style={styles.container}>

      <View style={{marginBottom: 20}}>
        <Text style={{color: '#fff'}}>{JSON.stringify(signedUser, null, 2)}</Text>
      </View>

      <View style={{gap: 10}}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFavoritesPress}>
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFollowedPeoplePress}>
          <Text style={styles.buttonText}>Pessoas seguidas</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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