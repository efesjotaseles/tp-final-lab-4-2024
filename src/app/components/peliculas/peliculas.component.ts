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
  public currentPage: number = -1;

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
          this.searchResults = response;
          this.currentPage = this.searchResults.page;
          console.log(this.searchResults);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handlePageChange(requestedPage: number) {
    if (
      requestedPage !== 0 &&
      requestedPage <= this.searchResults.total_pages
    ) {
      this.movieSearchForm.movieQueryParams.page = requestedPage;
      this.handleSearch(this.movieSearchForm);
    }
    console.log(requestedPage);
  }

  /**
   * DEPRECATED
   * @param event
   */
  /* handleSearch(event: MovieSearch) {
    this.searchResults = event;
  } */
}
