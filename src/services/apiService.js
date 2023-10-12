import axios from "axios";
import { API_TOKEN } from 'react-native-dotenv';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; // NOTE: refer to documentation for other sizes

const generalQuery = `include_adult=false&language=pt-BR`;


const TRENDING_TIME_WINDOW = {
  day: 'day',
  week: 'week',
}

export const MEDIA_TYPE = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person',
}

export const CREW_JOBS = {
  director: 'Director',
  screenplay: 'Screenplay',
  writer: 'Writer',
  author: 'Author',
}


export async function fetchNowPlayingMovies(page = 1) {
  return await fetchData(`/movie/now_playing`, `page=${page}`);
}

export async function fetchPopularMovies(page = 1) {
  return await fetchData(`/movie/popular`, `page=${page}`);
}

export async function fetchTopRatedMovies(page = 1) {
  return await fetchData(`/movie/top_rated`, `page=${page}`);
}

export async function fetchUpcomingMovies(page = 1) {
  return await fetchData(`/movie/upcoming`, `page=${page}`);
}

export async function fetchDayTrendingMovies() {
  return await fetchTrendingMovies(TRENDING_TIME_WINDOW.day);
}

export async function fetchWeekTrendingMovies() {
  return await fetchTrendingMovies(TRENDING_TIME_WINDOW.week);
}

async function fetchTrendingMovies(timeWindow) {
  return await fetchData(`/trending/movie/${timeWindow}`);
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
export async function fetchMoviesWithPeople(peopleIds, page = 1) {
  const peopleIdsQuery = peopleIds.join('|');
  return await fetchData(
    `/discover/movie`,
    `include_video=false&page=${page}&sort_by=primary_release_date.desc&with_people=${peopleIdsQuery}&without_genres=99`,
  );
}

export function getFullImagePath(imagePath) {
  if(imagePath) {
    return IMAGE_BASE_URL + imagePath;
  }
  return null;
}

async function fetchData(endpoint, query = '') {
  const url = `${API_BASE_URL + endpoint}?${query}&${generalQuery}`;
  const response = await axios.get(url, { headers: {Authorization: `Bearer ${API_TOKEN}`} });
  console.log(url);
  return response.data;
}