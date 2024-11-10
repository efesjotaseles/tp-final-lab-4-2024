import { Languages } from './Languages';
import { QueryParams } from './queryParams';

export interface MultiSearch {
  page: number;
  results: MultiResult[];
  total_pages: number;
  total_results: number;
}

export interface MultiResult {
  id: number;
  name?: string;
  original_name?: string;
  media_type: null | MediaType;
  adult: boolean;
  popularity: number;
  gender?: number;
  known_for_department?: KnownForDepartment;
  profile_path?: null | string;
  known_for?: MultiResult[];
  backdrop_path?: null | string;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: null | string;
  original_language?: null | Languages;
  genre_ids?: number[];
  release_date?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  first_air_date?: string;
  origin_country?: string[];
}

export enum KnownForDepartment {
  Acting = 'Acting',
  Directing = 'Directing',
}

export enum MediaType {
  Movie = 'movie',
  Person = 'person',
  Tv = 'tv',
}

//////////////////////////////////////////////////

/**
 * @param include_adult defaults to false
 * @param language defaults to en-US
 * @param page defaults to 1
 */
export interface MultiQueryParams extends QueryParams {
  /*  include_adult?: boolean;
  language?: string;
  page?: number; */
}
