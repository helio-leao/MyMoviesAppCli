import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, Linking } from 'react-native';
import ApiService from '../services/ApiService';
import { useState } from 'react';


export default function AuthScreen() {

  const [requestToken, setRequestToken] = useState('');


  async function handleSignin() {
    try {
      const response = await ApiService.createRequestToken();

      if(response.success) {
        setRequestToken(response.request_token);
        Linking.openURL(ApiService.getRequestUserPermissionUrl(response.request_token));
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleConfirmSession() {
    try {
      const response = await ApiService.createSession(requestToken);

      if(response.success) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    } finally {
      setRequestToken('');
    }
  }

  function handleSignout() {
    
  }


  return (
    <View style={styles.container}>
      {requestToken ? (
        <TouchableOpacity style={[styles.button, {marginBottom: 20}]} onPress={handleConfirmSession}>
          <Text style={styles.buttonText}>Confirm Session</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, {marginBottom: 20}]} onPress={handleSignin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignout}>
        <Text style={styles.buttonText}>Sign out</Text>
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
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  buttonText: {
    color: '#000',
  },
});