import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import LinearGradient from 'react-native-linear-gradient';
import ApiService from '../services/ApiService';
import placeholder_poster from '../assets/images/placeholder_poster.png';
import MediaRowList from '../components/MediaRowList';
import LoadableImage from '../components/LoadableImage';


export default function MediaDetails({
  mediaDetails,
  bodyContent = undefined,
  onFavoriteButtonPress = undefined,
}) {
  // TODO: add trailer to component
  console.log(mediaDetails.videos.results);

  return (
    <View style={styles.container}>
      {/* image */}
      <LoadableImage
        style={styles.backdropImage}
        source={{uri: ApiService.fetchFullImagePath(mediaDetails?.backdrop_path)}}
        placeholder={placeholder_poster}
      />
      
      {/* gradient container */}
      <LinearGradient
        style={styles.gradientContainer}
        colors={['#111111ff', '#11111100']}
        start={{x: 0, y: 0.15}}
        end={{x: 0, y: 0}}
      >
        {/* title for movies or name for tv */}
        <Text style={styles.title} numberOfLines={2}>
          {mediaDetails?.title || mediaDetails?.name}
        </Text>
        

        <ScrollView>          
          <View style={styles.contentScrollContainer}>

            {/* genres */}
            <View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <View style={styles.genresContainer}>
                  {mediaDetails?.genres.map(genre => (
                    <View key={genre.id} style={styles.genrePill}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* ratings and favorite button */}
            <View style={styles.ratingsAndFavoriteContainer}>
              <View style={styles.ratingsContainer}>
                <Fontisto name="star" size={30} color="yellow" />

                <View>
                  <Text style={{color: '#fff'}}>
                    <Text style={{fontSize: 20, fontWeight: '800'}}>
                      {mediaDetails?.vote_average.toFixed(1)}
                    </Text>
                    <Text style={{fontSize: 18}}>
                      /10
                    </Text>
                  </Text>

                  <Text style={styles.contentText}>{mediaDetails?.vote_count}</Text>
                </View>
              </View>

              {onFavoriteButtonPress && (
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={onFavoriteButtonPress}
                >
                  <FontAwesome
                    name={mediaDetails.account_states.favorite ? "heart" : "heart-o"}
                    size={16}
                    color="white"
                  />
                  <Text style={styles.favoriteButtonText}>Favorito</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* end ratings and favorite button */}

            {bodyContent}

            {mediaDetails['watch/providers'].results.BR?.flatrate && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{marginHorizontal: 10, marginTop: 20, flexDirection: 'row', gap: 10}}>
                  {mediaDetails['watch/providers'].results.BR.flatrate.map(provider => (
                    <Image
                      key={String(provider.provider_id)}
                      style={{width: 60, height: 60, borderRadius: 4}}
                      source={{uri: ApiService.fetchFullImagePath(provider.logo_path)}}
                    />
                  ))}
                </View>
              </ScrollView>
            )}

            {mediaDetails?.credits.cast.length > 0 && (
              <View style={{marginTop: bodyContent ? 30 : 0}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Elenco
                </Text>
                <MediaRowList
                  mediaDataList={mediaDetails.credits.cast}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

            {mediaDetails?.credits.crew.length > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Produção
                </Text>
                <MediaRowList
                  mediaDataList={mediaDetails.credits.crew}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

            {mediaDetails?.recommendations.total_results > 0 && (
              <View style={{marginTop: 30}}>
                <Text style={[styles.contentText, {fontSize: 22, marginHorizontal: 10, marginBottom: 16}]}>
                  Recomendações
                </Text>
                <MediaRowList
                  mediaDataList={mediaDetails.recommendations.results}
                  contentContainerStyle={{paddingHorizontal: 10}}
                />
              </View>
            )}

          </View>
        </ScrollView>
        
      </LinearGradient>
    </View>
  );
}
  
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  backdropImage: {
    aspectRatio: 16/9,
    width: '100%',
    height: undefined,
  },
  gradientContainer: {
    flex: 1,
    marginTop: -100,
  },
  title: {
    marginTop: 40,
    fontSize: 40,
    color: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    gap: 8,
  },
  genrePill: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  genreText: { 
    fontSize: 14,
    color: '#000'
  },
  ratingsAndFavoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  favoriteButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButtonText: {
    color: '#fff',
  },
  contentScrollContainer: {
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#fff',
  },
});