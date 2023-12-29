import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import LoadableImage from "./LoadableImage";
import ApiService from "../services/ApiService";
import placeholder_poster from '../assets/images/placeholder_poster.png';


export default function MediaCard({mediaData, onPress, style}) {
  
  return(
    <TouchableOpacity
      style={[style, {backgroundColor: '#333', overflow: 'hidden'}]}
      onPress={onPress}
    >
      {(ApiService.fetchMediaType(mediaData) !== ApiService.MediaType.PERSON &&
      mediaData.poster_path == null) && (
        <View style={styles.alternativeToImage}>
          <Text style={styles.text}>
            {mediaData.title || mediaData.name}
          </Text>
        </View>
      )}

      <LoadableImage
        style={styles.poster}
        source={{uri: ApiService.fetchFullImagePath(
          mediaData.poster_path || mediaData.profile_path)}}
        placeholder={placeholder_poster}
      />

      <Content mediaData={mediaData} />

      {/* NOTE: testing code */}
      {/* {mediaData.media_type && (
        <Text
          style={styles.text}
        >
          {mediaData.media_type}
        </Text>
      )} */}
    </TouchableOpacity>
  );
}


function Content({mediaData}) {
  const mediaType = ApiService.fetchMediaType(mediaData);

  if(mediaType === ApiService.MediaType.PERSON) {
    return (
      <View style={styles.contentContainer}>
        <Text
          style={[styles.text, {fontWeight: 800}]}
          numberOfLines={1}
        >
          {mediaData.name}
        </Text>

        <Text
          style={styles.text}
          numberOfLines={1}
        >
          {mediaData.character || mediaData.job}
        </Text>
      </View>
    );
  }

  if(mediaData.character || mediaData.job) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.text} numberOfLines={1}>
          {mediaData.character || mediaData.job}
        </Text>
      </View>
    )
  } else if(mediaData.rating) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.text}>
          Avaliação: {mediaData.rating}
        </Text>
      </View>
    )
  } else {
    return null;
  }
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
  alternativeToImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 6,
    zIndex: 1,
  },
});