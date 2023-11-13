import { StyleSheet, Text, View } from "react-native";


export default function FavoritesScreen() {
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