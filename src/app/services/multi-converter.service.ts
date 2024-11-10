import { Injectable } from '@angular/core';
import { TvResult } from '../models/tv';
import { MultiResult } from '../models/multi';
import { MovieResult } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MultiConverterService {
  toTvResult(multiResult: MultiResult): TvResult {
    let tvResult: TvResult = {
      adult: multiResult.adult,
      backdrop_path: multiResult.backdrop_path!,
      genre_ids: multiResult.genre_ids!,
      id: multiResult.id,
      origin_country: multiResult.origin_country!,
      original_language: multiResult.original_language!,
      original_name: multiResult.original_name!,
      overview: multiResult.overview!,
      popularity: multiResult.popularity,
      poster_path: multiResult.poster_path!,
      first_air_date: multiResult.first_air_date!,
      name: multiResult.name!,
      vote_average: multiResult.vote_average!,
      vote_count: multiResult.vote_count!,
    };
    return tvResult;
  }

  toMovieResult(multiResult: MultiResult): MovieResult {
    let movieResult: MovieResult = {
      adult: multiResult.adult,
      backdrop_path: multiResult.backdrop_path!,
      genre_ids: multiResult.genre_ids!,
      id: multiResult.id,
      original_language: multiResult.original_language!,
      original_title: multiResult.original_title!,
      overview: multiResult.overview!,
      popularity: multiResult.popularity,
      poster_path: multiResult.poster_path!,
      release_date: multiResult.release_date!,
      title: multiResult.title!,
      video: multiResult.video!,
      vote_average: multiResult.vote_average!,
      vote_count: multiResult.vote_count!,
    };

    return movieResult;
  }

  constructor() {}
}
