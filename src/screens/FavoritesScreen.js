import { useContext, useEffect } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import ApiService from "../services/ApiService";
import { SignedUserContext } from "../App";
import SessionStorageService from "../services/SessionStorageService";


export default function FavoritesScreen() {

  const {signedUser} = useContext(SignedUserContext);


  useEffect(() => {
    async function initializeData() {
      try {
        const sessionId = await SessionStorageService.getSessionId();
        const data = await ApiService.fetchFavoriteMovies(signedUser.id, sessionId);

        console.log(data);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Ocorreu um erro.', ToastAndroid.SHORT);
      }

    }
    initializeData();
  }, []);


  return(
    <View style={styles.screenContainer}>
      <Text>Favorites Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});