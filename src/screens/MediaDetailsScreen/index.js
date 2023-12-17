import { useRoute } from '@react-navigation/native';
import ApiService from '../../services/ApiService';
import PersonDetails from './components/PersonDetails';
import TvShowDetails from './components/TvShowDetails';
import MovieDetails from './components/MovieDetails';


export default function MediaDetailsScreen() {

  const route = useRoute();
  const {mediaId, mediaType} = route.params;


  switch(mediaType) {
    case ApiService.MediaType.MOVIE:
      return <MovieDetails movieId={mediaId} />
    case ApiService.MediaType.TV:
      return <TvShowDetails tvShowId={mediaId} />
    case ApiService.MediaType.PERSON:
      return <PersonDetails personId={mediaId} />
    default:
      console.error('Media type invalid:', mediaType);
      return null;
  }
}