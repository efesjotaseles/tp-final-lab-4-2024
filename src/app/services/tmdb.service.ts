import { Tv, TvQueryParams, TvSearch } from './../models/tv';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../environment/config';
import { Observable } from 'rxjs';
import { Movie, MovieQueryParams, MovieSearch } from '../models/movie';
import { MultiQueryParams, MultiSearch } from '../models/multi';
import { QueryParams } from '../models/queryParams';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiURL: string = 'https://api.themoviedb.org/3';
  private headers: HttpHeaders = new HttpHeaders().set(
    'Authorization',
    `Bearer ${config.tmdbToken}`
  );

  constructor(private http: HttpClient) {}

  //////////////////////////////////////////////////
  //MOVIE SECTION

  /**
   *
   * @param paramsObj query (for the name) is required.
   * @returns a result to the search of movies
   */
  searchMovies(paramsObj: MovieQueryParams): Observable<MovieSearch> {
    let params: HttpParams = this.setParams(paramsObj);

    return this.http.get<MovieSearch>(`${this.apiURL}/search/movie`, {
      headers: this.headers,
      params: params,
    });
  }

  searchMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiURL}/movie/${id}`, {
      headers: this.headers,
    });
  }

  getTrendingMovies() {
    return this.http.get<MovieSearch>(`${this.apiURL}/trending/movie/day`, {
      headers: this.headers,
    });
  }

  //////////////////////////////////////////////////
  //TV SECTION

  /**
   *
   * @param paramsObj query (for the name) is required.
   * @returns a result to the search of tv
   */
  searchTv(paramsObj: TvQueryParams): Observable<TvSearch> {
    let params: HttpParams = this.setParams(paramsObj);

    return this.http.get<TvSearch>(`${this.apiURL}/search/tv`, {
      headers: this.headers,
      params: params,
    });
  }

  searchTvById(id: number): Observable<Tv> {
    return this.http.get<Tv>(`${this.apiURL}/tv/${id}`, {
      headers: this.headers,
    });
  }

  getTrendingTV() {
    return this.http.get<TvSearch>(`${this.apiURL}/trending/tv/day`, {
      headers: this.headers,
    });
  }

  //////////////////////////////////////////////////
  //MULTI SECTION

  searchMulti(paramsObj: MultiQueryParams): Observable<MultiSearch> {
    let params: HttpParams = this.setParams(paramsObj);

    return this.http.get<MultiSearch>(`${this.apiURL}/search/multi`, {
      headers: this.headers,
      params: params,
    });
  }

  //////////////////////////////////////////////////
  //MISCELANEOUS

  private setParams(paramsObj: QueryParams): HttpParams {
    let params: HttpParams = new HttpParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
