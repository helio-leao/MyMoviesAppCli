import axios from "axios";

const { API_TOKEN } = process.env;

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const generalQuery = `&include_adult=false&language=pt-BR`;


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


async function fetchPopularMovies(page = 1) {
  return await fetchData(`/movie/popular`, `page=${page}` + generalQuery);
}

async function fetchPopularTvShows(page = 1) {
  return await fetchData(`/tv/popular`, `page=${page}` + generalQuery);
}

async function fetchTrendingMovies(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/movie/${timeWindow}`, generalQuery);
}

async function fetchTrendingTvShows(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/tv/${timeWindow}`, generalQuery);
}

async function fetchMovieDetails(movieId) {
  return await fetchData(`/movie/${movieId}`,
    `append_to_response=recommendations,credits` + generalQuery);
}

async function fetchTvShowDetails(tvShowId) {
  return await fetchData(`/tv/${tvShowId}`,
    `append_to_response=recommendations,credits` + generalQuery);
}

async function fetchMulti(name = '', page = 1) {
  return await fetchData(`/search/multi`, `query=${name}&page=${page}` + generalQuery);
}

// NOTE: removed genre is documentary (id 99)
async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  return await fetchData(
    `/discover/movie`,
    `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${
      peopleIds.join('|')}&without_genres=99` + generalQuery,
  );
}

function fetchFullImagePath(imagePath) {
  return imagePath ? IMAGE_BASE_URL + imagePath : null;
}

async function fetchData(endpoint, query) {
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`
  };
  let url = `${API_BASE_URL + endpoint}`;

  if(query) {
    url += `?${query}`;
  }
  console.log(url);

  const response = await axios.get(url, {headers});
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
  fetchMulti,
  fetchMoviesWithPeople,
  fetchFullImagePath,
}