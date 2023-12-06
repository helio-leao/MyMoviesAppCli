import ApiService from '../services/ApiService';
import MediaDetails from './MediaDetails';


export default function TvShowDetails({tvShowId}) {  
  return (
    <MediaDetails mediaId={tvShowId} mediaType={ApiService.MediaType.TV} />
  );
}