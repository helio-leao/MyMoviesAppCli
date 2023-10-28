import { StyleSheet, View, ToastAndroid, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useEffect, useState } from 'react';
import AuthStorageService from '../services/AuthStorageService';
import { SignedUserContext } from '../App';
import WebView from 'react-native-webview';


export default function UserScreen() {

  const {signedUser, setSignedUser} = useContext(SignedUserContext);
  const [requestToken, setRequestToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function createRequestToken() {
      try {
        const response = await ApiService.createRequestToken();
  
        if(response.success) {
          setRequestToken(response.request_token);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }
    }

    if(!signedUser) {
      createRequestToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function handleLogout() {
    try {
      const sessionId = await AuthStorageService.getSessionId();
      const response = await ApiService.deleteSession(sessionId);

      if(response.success) {
        await AuthStorageService.deleteSessionId();
        setSignedUser(null);
        ToastAndroid.show('Logged out.', ToastAndroid.SHORT);
        // NOTE: create another request token for another login???
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    }
  }

  async function checkLoginConfirmation(navState) {    
    if(!isLoginConfirmed(navState.url)) {
      return;
    }

    try {
      await handleConfirmLogin();    
      ToastAndroid.show('Logged in.', ToastAndroid.SHORT);
    } catch (error) {
      console.log('error response: ', error.response.data);
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
    }
  }

  function isLoginConfirmed(url) {
    const allowUrl = ApiService.fetchRequestUserPermissionUrl(requestToken) + '/allow';
    return allowUrl === url;
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

      {requestToken ? (
        <WebView
          source={{ uri: ApiService.fetchRequestUserPermissionUrl(requestToken) }}
          onNavigationStateChange={checkLoginConfirmation}
        />        
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
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