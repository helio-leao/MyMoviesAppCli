import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useEffect, useState } from 'react';
import SessionStorageService from '../services/SessionStorageService';
import { SignedUserContext } from '../App';
import { useNavigation } from '@react-navigation/native';


export default function UserScreen() {

  const {setSignedUser} = useContext(SignedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    async function loadUserData() {
      // TODO
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
        setSignedUser(null);  // NOTE: done after navigate so it doesn't mount LoginScreen
        await SessionStorageService.deleteSessionId();
        ToastAndroid.show('Logged out.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
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
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#000',
  },
});