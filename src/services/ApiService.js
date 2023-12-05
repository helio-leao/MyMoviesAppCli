import axios from "axios";


// CONSTANTS

const { API_TOKEN } = process.env;

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const COMMON_QUERY = `&include_adult=false&language=pt-BR`;


// ENUMS

const TrendingTimeWindow = {
  DAY: 'day',
  WEEK: 'week',
}

const MediaType = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person',
}

const CrewJob = {
  DIRECTOR: 'Director',
  SCREENPLAY: 'Screenplay',
  WRITER: 'Writer',
  AUTHOR: 'Author',
  NOVEL: 'Novel',
  THEATRE_PLAY: 'Theatre Play',
}

const TvShowStatus = {
  RETURNING_SERIES: 'Returning Series',
  PLANNED: 'Planned',
  IN_PRODUCTION: 'In Production',
  ENDED: 'Ended',
  CANCELED: 'Canceled',
  PILOT: 'Pilot',
}

const Genres = {
  DOCUMENTARY: 99,
}


// MEDIA FETCH FUNCTIONS

async function fetchTrendingMovies(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/movie/${timeWindow}`, COMMON_QUERY);
}

async function fetchTrendingTvShows(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/tv/${timeWindow}`, COMMON_QUERY);
}

async function fetchMovieDetails(movieId) {
  return await fetchData(`/movie/${movieId}`,
    `append_to_response=recommendations,credits` + COMMON_QUERY);
}

async function fetchTvShowDetails(tvShowId) {
  return await fetchData(`/tv/${tvShowId}`,
    `append_to_response=recommendations,credits` + COMMON_QUERY);
}

async function fetchPersonDetails(personId) {
  return await fetchData(`/person/${personId}`,
  `append_to_response=combined_credits` + COMMON_QUERY);
}

async function fetchMulti(name = '', page = 1) {
  return await fetchData(`/search/multi`, `query=${name}&page=${page}` + COMMON_QUERY);
}

async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  return await fetchData(
    `/discover/movie`,
    `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${
      peopleIds.join('|')}&without_genres=${Genres.DOCUMENTARY}` + COMMON_QUERY);
}

function fetchFullImagePath(imagePath, size = 'original') {
  if(!imagePath) {
    return null;
  }

  const fullImagePath = `${IMAGE_BASE_URL}/${size}${imagePath}`;
  // console.log(fullImagePath);

  return fullImagePath;
}

function fetchMediaType(mediaData) {
  // NOTE: for media that has media_type property (i.e. multi, combined_credits)
  if(mediaData.hasOwnProperty('media_type')) {
    return mediaData.media_type;
  }

  // NOTE: for media that does not have media_type property
  if(mediaData.hasOwnProperty('title') && mediaData.hasOwnProperty('poster_path')) {
    return MediaType.MOVIE;
  } else if(mediaData.hasOwnProperty('name') && mediaData.hasOwnProperty('poster_path')) {
    return MediaType.TV;
  } else if(mediaData.hasOwnProperty('name') && mediaData.hasOwnProperty('profile_path')) {
    return MediaType.PERSON;
  } else {
    return null;
  }
}


// HELPER FUNCTIONS

async function fetchData(endpoint, query) {
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`
  };
  let url = API_BASE_URL + endpoint;

  if(query) {
    url += `?${query}`;
  }
  console.log(url);

  const response = await axios.get(url, {headers});
  return response.data;
}

// ISSUE: there's no "with_people" for tv on the api
// ISSUE: when uncommented this function will render the others useless, it will keep
// giving status 401 api key not authorized
// async function fetchTvShowsWithPeople(peopleIds = [], page = 1) {
//   return await fetchData(
//     `/discover/tv`,
//     `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${
//       peopleIds.join('|')}&without_genres=99` + COMMON_QUERY,
//   );
// }


// AUTHENTICATION FUNCTIONS

function fetchRequestUserPermissionUrl(requestToken) {
  return `https://www.themoviedb.org/authenticate/${requestToken}`;
}

async function createRequestToken() {
  return await fetchData('/authentication/token/new');
}

// TODO: helper function postData
async function createSession(requestToken) {
  const url = API_BASE_URL + '/authentication/session/new';

  const data = {
    request_token: requestToken,
  };
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  console.log(url);

  const response = await axios.post(url, data, {headers});
  return response.data;
}

async function deleteSession(sessionId) {
  const url = API_BASE_URL + '/authentication/session';

  const data = {
    session_id: sessionId,
  };
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  console.log(url);

  const response = await axios.delete(url, {data, headers});
  return response.data;
}

async function fetchAccountDetailsBySessionId(sessionId) {
  return await fetchData('/account', `session_id=${sessionId}`);
}


// AUTHENTICATED USER FUNCTIONS

async function fetchFavorites(accountId, sessionId, mediaType, page = 1) {
  let path = `/account/${accountId}/favorite`;

  if(mediaType === MediaType.MOVIE) {
    path += '/movies';
  } else if(mediaType === MediaType.TV) {
    path += '/tv';
  } else {
    throw new Error(
      `MediaType has to be "tv" or "movies". Received: "${mediaType}"`
    );
  }
  
  return await fetchData(path, `session_id=${sessionId}&sort_by=created_at.desc&page=${page}` + COMMON_QUERY);
}

async function addFavorite(accountId, sessionId, mediaData, mediaType) {
  const url = API_BASE_URL + `/account/${accountId}/favorite?session_id=${sessionId}`;

  const data = {
    media_type: mediaType,
    media_id: mediaData.id,
    favorite: true,
  };
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  console.log(url);

  const response = await axios.post(url, data, {headers});
  return response.data;
}


export default {
  TrendingTimeWindow,
  MediaType,
  CrewJob,
  TvShowStatus,
  fetchTrendingMovies,
  fetchTrendingTvShows,
  fetchMovieDetails,
  fetchTvShowDetails,
  fetchPersonDetails,
  fetchMulti,
  fetchMoviesWithPeople,
  fetchFullImagePath,
  fetchMediaType,
  createRequestToken,
  fetchRequestUserPermissionUrl,
  createSession,
  deleteSession,
  fetchAccountDetailsBySessionId,
  fetchFavorites,
  addFavorite,
}