import ApiService from '../services/ApiService';
import MediaDetails from './MediaDetails';


export default function MovieDetails({movieId}) {  
  return (
    <MediaDetails mediaId={movieId} mediaType={ApiService.MediaType.MOVIE} />
  );
}