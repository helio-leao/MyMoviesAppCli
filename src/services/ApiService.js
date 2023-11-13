import axios from "axios";


// CONSTANTS

const { API_TOKEN } = process.env;

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const GENERAL_QUERY = `&include_adult=false&language=pt-BR`;


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
}

const TvShowStatus = {
  RETURNING_SERIES: 'Returning Series',
  PLANNED: 'Planned',
  IN_PRODUCTION: 'In Production',
  ENDED: 'Ended',
  CANCELED: 'Canceled',
  PILOT: 'Pilot',
}


// MEDIA FETCH FUNCTIONS

async function fetchPopularMovies(page = 1) {
  return await fetchData(`/movie/popular`, `page=${page}` + GENERAL_QUERY);
}

async function fetchPopularTvShows(page = 1) {
  return await fetchData(`/tv/popular`, `page=${page}` + GENERAL_QUERY);
}

async function fetchTrendingMovies(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/movie/${timeWindow}`, GENERAL_QUERY);
}

async function fetchTrendingTvShows(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/tv/${timeWindow}`, GENERAL_QUERY);
}

async function fetchMovieDetails(movieId) {
  return await fetchData(`/movie/${movieId}`,
    `append_to_response=recommendations,credits` + GENERAL_QUERY);
}

async function fetchTvShowDetails(tvShowId) {
  return await fetchData(`/tv/${tvShowId}`,
    `append_to_response=recommendations,credits` + GENERAL_QUERY);
}

async function fetchPersonDetails(personId) {
  return await fetchData(`/person/${personId}`,
    `append_to_response=movie_credits` + GENERAL_QUERY);
    // TODO: use combined_credits for movies and tv shows
    // `append_to_response=combined_credits` + GENERAL_QUERY);
}

async function fetchMulti(name = '', page = 1) {
  return await fetchData(`/search/multi`, `query=${name}&page=${page}` + GENERAL_QUERY);
}

async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  // NOTE: removed genre is documentary (id 99)
  return await fetchData(
    `/discover/movie`,
    `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${
      peopleIds.join('|')}&without_genres=99` + GENERAL_QUERY,
  );
}

function fetchFullImagePath(imagePath) {
  return imagePath ? IMAGE_BASE_URL + imagePath : null;
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

async function fetchFavorites(accountId, sessionId, mediaType) {
  const formattedMediaType = mediaType === MediaType.TV ? mediaType : `${mediaType}s`;

  const url = API_BASE_URL +
    `/account/${accountId}/favorite/${formattedMediaType}?session_id=${sessionId}&sort_by=created_at.desc` +
    GENERAL_QUERY;

  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  console.log(url);

  const response = await axios(url, {headers});
  return response.data;
}

async function addFavorite(accountId, sessionId, mediaData) {
  const url = API_BASE_URL + `/account/${accountId}/favorite?session_id=${sessionId}`;

  const data = {
    media_type: mediaData.media_type,
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
  fetchPopularMovies,
  fetchPopularTvShows,
  fetchTrendingMovies,
  fetchTrendingTvShows,
  fetchMovieDetails,
  fetchTvShowDetails,
  fetchPersonDetails,
  fetchMulti,
  fetchMoviesWithPeople,
  fetchFullImagePath,
  createRequestToken,
  fetchRequestUserPermissionUrl,
  createSession,
  deleteSession,
  fetchAccountDetailsBySessionId,
  fetchFavorites,
  addFavorite,
}