import { TvQueryParams, TvSearch } from './../models/tv';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../environment/config';
import { Observable } from 'rxjs';
import { MovieQueryParams, MovieSearch } from '../models/movie';

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

  /* getMoviesTEST(): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('query', 'skinamarink')
      .set('include_adult', 'false')
      .set('language', 'en-US');
    return this.http.get<any>(this.apiURL + '/search/movie', {
      headers: this.headers,
      params: params,
    });
  } */

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

  searchTv(paramsObj: TvQueryParams): Observable<TvSearch> {
    let params: HttpParams = this.setParams(paramsObj);

    return this.http.get<TvSearch>(`${this.apiURL}/search/movie`, {
      headers: this.headers,
      params: params,
    });
  }

  private setParams(paramsObj: MovieQueryParams | TvQueryParams): HttpParams {
    let params: HttpParams = new HttpParams();

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }
}
