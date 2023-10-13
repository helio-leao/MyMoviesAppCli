import axios from "axios";
import { API_TOKEN } from 'react-native-dotenv';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const GENERAL_QUERY = `include_adult=false&language=pt-BR`;


export const TrendingTimeWindow = {
  DAY: 'day',
  WEEK: 'week',
}

export const MediaType = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person',
}

export const CrewJob = {
  DIRECTOR: 'Director',
  SCREENPLAY: 'Screenplay',
  WRITER: 'Writer',
  AUTHOR: 'Author',
}

export const TvShowStatus = {
  RETURNING_SERIES: 'Returning Series',
  PLANNED: 'Planned',
  IN_PRODUCTION: 'In Production',
  ENDED: 'Ended',
  CANCELED: 'Canceled',
  PILOT: 'Pilot',
}


export async function fetchPopularMovies(page = 1) {
  return await fetchData(`/movie/popular`, `page=${page}`);
}

export async function fetchPopularTvShows(page = 1) {
  return await fetchData(`/tv/popular`, `page=${page}`);
}

export async function fetchTrendingMovies(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/movie/${timeWindow}`);
}

export async function fetchTrendingTvShows(timeWindow = TrendingTimeWindow.DAY) {
  return await fetchData(`/trending/tv/${timeWindow}`);
}

export async function fetchMovieDetails(movieId) {
  return await fetchData(`/movie/${movieId}`, `append_to_response=recommendations,credits`);
}

export async function fetchTvShowDetails(tvShowId) {
  return await fetchData(`/tv/${tvShowId}`, `append_to_response=recommendations,credits`);
}

export async function fetchMulti(name = '', page = 1) {
  return await fetchData(`/search/multi`, `query=${name}&page=${page}`);
}

// NOTE: removed genre is documentary (id 99)
export async function fetchMoviesWithPeople(peopleIds = [], page = 1) {
  return await fetchData(
    `/discover/movie`,
    `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${peopleIds
      .join('|')}&without_genres=99`,
  );
}

export function getFullImagePath(imagePath) {
  if(imagePath) {
    return IMAGE_BASE_URL + imagePath;
  }
  return null;
}

async function fetchData(endpoint, query = '') {
  const url = `${API_BASE_URL + endpoint}?${query}&${GENERAL_QUERY}`;
  const response = await axios.get(url, { headers: {Authorization: `Bearer ${API_TOKEN}`} });
  console.log(url);
  return response.data;
}