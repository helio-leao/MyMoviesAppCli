import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, Linking } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useState } from 'react';
import AuthStorageService from '../services/AuthStorageService';
import { SignedUserContext } from '../App';


export default function AuthScreen() {

  const [requestToken, setRequestToken] = useState('');
  const {signedUser, setSignedUser} = useContext(SignedUserContext);


  async function handleLogin() {
    try {
      if(await AuthStorageService.getSessionId()) {
        ToastAndroid.show('Already logged in.', ToastAndroid.SHORT);
        return;
      }

      const response = await ApiService.createRequestToken();

      if(response.success) {
        setRequestToken(response.request_token);
        Linking.openURL(ApiService.fetchRequestUserPermissionUrl(response.request_token));
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
        await AuthStorageService.setSessionId(response.session_id);

        const userData = await ApiService.fetchAccountDetailsBySessionId(response.session_id);
        setSignedUser(userData);

        ToastAndroid.show('Logged in.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    } finally {
      setRequestToken('');
    }
  }

  async function handleLogout() {
    try {
      const sessionId = await AuthStorageService.getSessionId();

      if(!sessionId) {
        ToastAndroid.show('Already logged out.', ToastAndroid.SHORT);
        return;
      }

      const response = await ApiService.deleteSession(sessionId);

      if(response.success) {
        await AuthStorageService.deleteSessionId();
        setSignedUser(null);
        ToastAndroid.show('Logged out.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }


  return (
    <View style={styles.container}>

      {requestToken ? (
        <TouchableOpacity style={[styles.button, {marginBottom: 20}]} onPress={handleConfirmSession}>
          <Text style={styles.buttonText}>Confirm Session</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, {marginBottom: 20}]} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

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
  },
  buttonText: {
    color: '#000',
  },
});