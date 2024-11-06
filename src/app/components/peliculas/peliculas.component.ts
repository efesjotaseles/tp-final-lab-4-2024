import { TmdbService } from './../../services/tmdb.service';
import { Component } from '@angular/core';
import {
  MovieQueryParams,
  MovieResult,
  MovieSearch,
  MovieSearchForm,
} from '../../models/movie';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
})
export class PeliculasComponent {
  constructor(private tmdbService: TmdbService) {}

  public searchResults: MovieSearch = {
    page: -1,
    total_pages: -1,
    total_results: -1,
    results: [],
  };

  public movieSearchForm: MovieSearchForm = {
    movieQueryParams: {
      query: '',
    },
  };

  handleSearch(movieSearchForm: MovieSearchForm) {
    this.movieSearchForm = movieSearchForm;
    this.tmdbService
      .searchMovies(this.movieSearchForm.movieQueryParams)
      .subscribe({
        next: (response) => {
          //Filter before...
          if (
            movieSearchForm.genre !== null &&
            movieSearchForm.genre !== undefined
          ) {
            //console.log(typeof movieSearchForm.genre);
            response.results = response.results.filter((result) => {
              //console.log(result.genre_ids);
              return result.genre_ids.includes(Number(movieSearchForm.genre!));
            });
          }
          //console.log(response.results);
          this.searchResults = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handlePageChange(direction: number) {
    let pageRequested: number = this.searchResults.page + direction;
    if (
      pageRequested !== 0 &&
      pageRequested <= this.searchResults.total_pages
    ) {
      this.movieSearchForm.movieQueryParams.page = pageRequested;
      this.handleSearch(this.movieSearchForm);
    }
    console.log(direction);
  }

  /**
   * DEPRECATED
   * @param event
   */
  /* handleSearch(event: MovieSearch) {
    this.searchResults = event;
  } */
}
