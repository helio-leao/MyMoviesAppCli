import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import LoadableImage from "./LoadableImage";
import ApiService from "../services/ApiService";
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function MediaCard({mediaData, onPress, style}) {
  
  return(
    <TouchableOpacity
      style={[style, {backgroundColor: '#333', overflow: 'hidden', borderRadius: 4}]}
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

        {/* NOTE: if media is a cast person, shows the name of character */}
        {/* NOTE: if media is a crew person, shows the job of the person */}
        {(mediaData.character || mediaData.job) && (
          <Text
            style={[styles.text, {fontWeight: 800}]}
            numberOfLines={1}
          >
            {mediaData.character || mediaData.job}
          </Text>
        )}

        {mediaData.media_type && (
          <Text
            style={styles.text}
          >
            {mediaData.media_type}
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
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  text: {
    color: '#fff',
  },
});