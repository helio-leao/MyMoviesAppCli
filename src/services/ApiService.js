import axios from "axios";


// CONSTANTS

const { API_TOKEN } = process.env;

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const commonQuery = `include_adult=false&language=pt-BR`;


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

const Department = {
  ACTING: 'Acting',
}

const CrewJob = {
  DIRECTOR: 'Director',
  SCREENPLAY: 'Screenplay',
  WRITER: 'Writer',
  AUTHOR: 'Author',
  NOVEL: 'Novel',
  THEATRE_PLAY: 'Theatre Play',
}

const Genres = {
  DOCUMENTARY: 99,
}


// MEDIA FETCH FUNCTIONS

async function fetchTrendingMovies(timeWindow = TrendingTimeWindow.DAY) {
  const url = `/trending/movie/${timeWindow}?${commonQuery}`
  return await fetchData(url);
}

async function fetchTrendingTvShows(timeWindow = TrendingTimeWindow.DAY) {
  const url = `/trending/tv/${timeWindow}?${commonQuery}`
  return await fetchData(url);
}

async function fetchMovieDetails(movieId) {
  const url = `/movie/${movieId}?append_to_response=external_ids,recommendations,credits,videos,account_states,watch/providers&${commonQuery}`
  return await fetchData(url);
}

async function fetchTvShowDetails(tvShowId) {
  const url = `/tv/${tvShowId}?append_to_response=external_ids,recommendations,credits,videos,account_states,watch/providers&${commonQuery}`
  return await fetchData(url);
}

async function fetchPersonDetails(personId) {
  const url = `/person/${personId}?append_to_response=external_ids,combined_credits&${commonQuery}`
  return await fetchData(url);
}

async function fetchMulti(name = '', page = 1) {
  const url = `/search/multi?query=${name}&page=${page}&${commonQuery}`
  return await fetchData(url);
}

async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  const url = `/discover/movie?include_video=false&page=${
    page}&sort_by=primary_release_date.desc&with_people=${
      peopleIds.join('|')}&without_genres=${Genres.DOCUMENTARY}&${commonQuery}`
    
  return await fetchData(url);
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

async function fetchData(url) {
  const uri = API_BASE_URL + url;
  const headers = { Authorization: `Bearer ${API_TOKEN}` };
  console.log(uri);

  const response = await axios.get(uri, {headers});
  return response.data;
}

async function postData(url, data) {
  const uri = API_BASE_URL + url;
  const headers = { Authorization: `Bearer ${API_TOKEN}` };
  console.log(uri);

  const response = await axios.post(uri, data, {headers});
  return response.data;
}


// AUTHENTICATION FUNCTIONS

function fetchRequestUserPermissionUrl(requestToken) {
  return `https://www.themoviedb.org/authenticate/${requestToken}`;
}

async function createRequestToken() {
  return await fetchData('/authentication/token/new');
}

async function createSession(requestToken) {
  const url = '/authentication/session/new';
  const data = { request_token: requestToken };

  return await postData(url, data);
}

async function deleteSession(sessionId) {
  const url = API_BASE_URL + '/authentication/session';
  const data = { session_id: sessionId };
  const headers = { Authorization: `Bearer ${API_TOKEN}` };

  console.log(url);

  const response = await axios.delete(url, {data, headers});
  return response.data;
}

async function fetchAccountDetailsBySessionId(sessionId) {
  const url = `/account?session_id=${sessionId}`
  return await fetchData(url);
}


// AUTHENTICATED USER FUNCTIONS

async function fetchFavorites(accountId, sessionId, mediaType, page = 1) {
  let url = `/account/${accountId}/favorite`;

  if(mediaType === MediaType.MOVIE) {
    url += '/movies';
  } else if(mediaType === MediaType.TV) {
    url += '/tv';
  } else {
    throw new Error(`MediaType has to be "tv" or "movies". Received: "${mediaType}"`);
  }

  url += `?session_id=${sessionId}&sort_by=created_at.desc&page=${page}&${commonQuery}`
  
  return await fetchData(url);
}

// NOTE: favorites can be tv or movie (person not suported by the API)
async function addFavorite(accountId, sessionId, mediaData) {
  const url = `/account/${accountId}/favorite?session_id=${sessionId}`;

  const data = {
    media_type: fetchMediaType(mediaData),
    media_id: mediaData.id,
    favorite: true,
  };

  return await postData(url, data);
}

async function removeFavorite(accountId, sessionId, mediaData) {
  const url = `/account/${accountId}/favorite?session_id=${sessionId}`;

  const data = {
    media_type: fetchMediaType(mediaData),
    media_id: mediaData.id,
    favorite: false,
  };

  return await postData(url, data);
}

async function addMovieRating(movieId, sessionId, rate) {
  const url = `/movie/${movieId}/rating?session_id=${sessionId}`;
  const data = { value: rate };
  return await postData(url, data);
}

async function deleteMovieRating(movieId, sessionId) {
  const url = `/movie/${movieId}/rating?session_id=${sessionId}`;
  const headers = { Authorization: `Bearer ${API_TOKEN}` };
  const response = await axios.delete(API_BASE_URL + url, {headers});
  return response.data;
}

async function addTvShowRating(tvShowId, sessionId, rate) {
  const url = `/tv/${tvShowId}/rating?session_id=${sessionId}`;
  const data = { value: rate };
  return await postData(url, data);
}

async function deleteTvShowRating(tvShowId, sessionId) {
  const url = `/tv/${tvShowId}/rating?session_id=${sessionId}`;
  const headers = { Authorization: `Bearer ${API_TOKEN}` };
  const response = await axios.delete(API_BASE_URL + url, {headers});
  return response.data;
}


export default {
  TrendingTimeWindow,
  MediaType,
  Department,
  CrewJob,
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
  removeFavorite,
  addMovieRating,
  deleteMovieRating,
  addTvShowRating,
  deleteTvShowRating,
}