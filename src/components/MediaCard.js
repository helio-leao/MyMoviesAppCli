import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import LoadableImage from "./LoadableImage";
import ApiService from "../services/ApiService";
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function MediaCard({mediaData, onPress, style}) {
  
  return(
    <TouchableOpacity
      style={[style, {backgroundColor: '#333', borderRadius: 4, overflow: 'hidden'}]}
      onPress={onPress}
    >
      <LoadableImage
        style={styles.poster}
        source={{uri: ApiService.fetchFullImagePath(
          mediaData.poster_path || mediaData.profile_path)}}
        placeholder={placeholder_poster}
      />

      <View style={styles.contentContainer}>
        <Text
          style={styles.text}
          numberOfLines={1}
        >
          {mediaData.title || mediaData.name}
        </Text>

        {mediaData.job && (
          <Text
            style={styles.text}
            numberOfLines={1}
          >
            {mediaData.job}
          </Text>
        )}
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  poster: {
    aspectRatio: 2/3,
    width: '100%',
    height: undefined,
  },
  contentContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  text: {
    color: '#fff',
  },
});