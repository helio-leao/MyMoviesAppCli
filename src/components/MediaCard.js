import { StyleSheet, TouchableOpacity, Text } from "react-native";
import LoadableImage from "./LoadableImage";
import ApiService from "../services/ApiService";
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function MediaCard({mediaData, onPress, contentContainerStyle}) {
  
  return(
    <TouchableOpacity
      style={contentContainerStyle}
      onPress={onPress}
    >
      <LoadableImage
        style={styles.poster}
        source={{uri: ApiService.fetchFullImagePath(
          mediaData.poster_path || mediaData.profile_path)}}
        placeholder={placeholder_poster}
      />

      <Text
        style={styles.text}
        numberOfLines={1}
      >
        {mediaData.title || mediaData.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  poster: {
    aspectRatio: 2/3,
    width: '100%',
    height: undefined,
  },
  text: {
    color: '#fff',
  },
});