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

async function fetchTrendingMedia(mediaType, timeWindow = TrendingTimeWindow.DAY) {
  const url = `/trending/${mediaType}/${timeWindow}?${commonQuery}`;
  return await fetchData(url);
}

async function fetchMediaDetails(mediaId, mediaType, sessionId = undefined) {
  const mediaDetailsUrl = `/${mediaType}/${mediaId}?append_to_response=external_ids,recommendations,credits,videos,watch/providers&${commonQuery}`;

  if(!sessionId) {
    return await fetchData(mediaDetailsUrl);
  }

  const mediaAccountStatesUrl = `/${mediaType}/${mediaId}/account_states?session_id=${sessionId}`;

  const [
    mediaDetails,
    mediaAccountStates,
  ] = await Promise.all([
    fetchData(mediaDetailsUrl),
    fetchData(mediaAccountStatesUrl),
  ]);

  return {
    ...mediaDetails,
    account_states: {
      ...mediaAccountStates,
    },
  };
}

async function fetchPersonDetails(personId) {
  const url = `/person/${personId}?append_to_response=external_ids,combined_credits&${commonQuery}`;
  return await fetchData(url);
}

async function fetchMulti(name = '', page = 1) {
  const url = `/search/multi?query=${name}&page=${page}&${commonQuery}`;
  return await fetchData(url);
}

async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  const url = `/discover/movie?include_video=false&page=${
    page}&sort_by=primary_release_date.desc&with_people=${
      peopleIds.join('|')}&without_genres=${Genres.DOCUMENTARY}&${commonQuery}`;
    
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
  if(mediaData.hasOwnProperty('media_type')) {
    return mediaData.media_type;
  }

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

  const response = await axios.delete(url, {headers, data});
  return response.data;
}

async function fetchAccountDetailsBySessionId(sessionId) {
  const url = `/account?session_id=${sessionId}`;
  return await fetchData(url);
}


// AUTHENTICATED USER FUNCTIONS

async function fetchRated(accountId, sessionId, mediaType, page = 1) {
  const url = `/account/${accountId}/rated/${mediaType === MediaType.MOVIE ?
    'movies' : mediaType}?session_id=${sessionId}&sort_by=created_at.desc&page=${page}&${commonQuery}`;

  return await fetchData(url);
}

async function fetchFavorites(accountId, sessionId, mediaType, page = 1) {
  const url = `/account/${accountId}/favorite/${mediaType === MediaType.MOVIE ?
    'movies' : mediaType}?session_id=${sessionId}&sort_by=created_at.desc&page=${page}&${commonQuery}`;

  return await fetchData(url);
}

// NOTE: favorites can be tv or movie (person not suported by the API)
async function setFavorite(accountId, sessionId, mediaData, favorite) {
  const url = `/account/${accountId}/favorite?session_id=${sessionId}`;

  const data = {
    media_type: fetchMediaType(mediaData),
    media_id: mediaData.id,
    favorite: favorite,
  };

  return await postData(url, data);
}

async function addMediaRating(mediaId, mediaType, sessionId, rating) {
  const url = `/${mediaType}/${mediaId}/rating?session_id=${sessionId}`;
  const data = { value: rating };
  return await postData(url, data);
}

async function deleteMediaRating(mediaId, mediaType, sessionId) {
  const url = API_BASE_URL + `/${mediaType}/${mediaId}/rating?session_id=${sessionId}`;
  const headers = { Authorization: `Bearer ${API_TOKEN}` };

  console.log(url);

  const response = await axios.delete(url, {headers});
  return response.data;
}


export default {
  TrendingTimeWindow,
  MediaType,
  Department,
  CrewJob,
  fetchTrendingMedia,
  fetchMediaDetails,
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
  fetchRated,
  fetchFavorites,
  setFavorite,
  addMediaRating,
  deleteMediaRating,
}