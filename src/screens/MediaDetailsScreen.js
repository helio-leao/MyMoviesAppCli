import { useRoute } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import PersonDetails from '../components/PersonDetails';
import MediaDetails from '../components/MediaDetails';


export default function MediaDetailsScreen() {

  const route = useRoute();
  const {id, mediaType} = route.params;


  switch(mediaType) {
    case ApiService.MediaType.MOVIE:
    case ApiService.MediaType.TV:
      return <MediaDetails id={id} mediaType={mediaType} />
    case ApiService.MediaType.PERSON:
      return <PersonDetails id={id} />
    default:
      console.warn('Media type invalid:', mediaType);
      return null;
  }
}