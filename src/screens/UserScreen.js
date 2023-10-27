import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useState } from 'react';
import AuthStorageService from '../services/AuthStorageService';
import { SignedUserContext } from '../App';
import WebView from 'react-native-webview';


export default function UserScreen() {

  const {signedUser, setSignedUser} = useContext(SignedUserContext);
  const [requestToken, setRequestToken] = useState('');


  async function handleLogin() {
    try {
      const response = await ApiService.createRequestToken();

      if(response.success) {
        setRequestToken(response.request_token);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function handleLogout() {
    try {
      const sessionId = await AuthStorageService.getSessionId();
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

  // FIXME: sometimes it logs in the user and still triggers the catch clause with
  // axios 401 error message
  async function checkLoginConfirmation({url}) {    
    if(!isLoginConfirmed(url)) {
      return;
    }

    try {
      await handleConfirmLogin();    
      ToastAndroid.show('Logged in.', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    } finally {
      setRequestToken('');
    }
  }

  async function handleConfirmLogin() {
    const response = await ApiService.createSession(requestToken);

    if(response.success) {
      await AuthStorageService.setSessionId(response.session_id);
      const userData = await ApiService.fetchAccountDetailsBySessionId(response.session_id);
      setSignedUser(userData);
      // NOTE: store account details on storage too???
    }
  }

  function isLoginConfirmed(url) {
    const allowUrl = ApiService.fetchRequestUserPermissionUrl(requestToken) + '/allow';
    return allowUrl === url;
  }


  return (
    <View style={styles.container}>

      {signedUser ? (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      {requestToken && (
        <WebView
          source={{ uri: ApiService.fetchRequestUserPermissionUrl(requestToken) }}
          style={{ marginTop: 20 }}
          onNavigationStateChange={checkLoginConfirmation}
        />
      )}

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