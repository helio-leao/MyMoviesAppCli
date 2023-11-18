import { StyleSheet, View, ToastAndroid, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import { useContext, useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { SessionContext } from '../contexts/SessionContext';


export default function LoginScreen() {

  const {createSession} = useContext(SessionContext);
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
    createRequestToken();
  }, []);
  

  async function checkLoginConfirmation(navState) {    
    if(!isLoginConfirmed(navState.url)) {
      return;
    }

    try {
      // NOTE: UserTab navigator will be replaced and the user screen will mount
      await handleLoginConfirmed();    
      ToastAndroid.show('Logged in.', ToastAndroid.SHORT);
    } catch (error) {
      console.log('error response: ', error.response.data);
      ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
    } finally {
      setRequestToken('');
    }
  }

  async function handleLoginConfirmed() {
    const response = await ApiService.createSession(requestToken);

    if(response.success) {
      const {session_id} = response;

      const userData = await ApiService.fetchAccountDetailsBySessionId(session_id);
      await createSession(session_id, userData);
    }
  }

  function isLoginConfirmed(url) {
    const allowUrl = ApiService.fetchRequestUserPermissionUrl(requestToken) + '/allow';
    return allowUrl === url;
  }


  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={'large'} color={'#fff'} />
      ) : (
        <WebView
          source={{ uri: ApiService.fetchRequestUserPermissionUrl(requestToken) }}
          onNavigationStateChange={checkLoginConfirmation}
        />
      )}
    </View>      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
  },
});