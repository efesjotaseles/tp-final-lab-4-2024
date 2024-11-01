import { TmdbService } from './../../services/tmdb.service';
import { Component } from '@angular/core';
import { MovieQueryParams, MovieResult, MovieSearch } from '../../models/movie';

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

  handleSearch(movieQueryParams: MovieQueryParams) {
    this.tmdbService.searchMovies(movieQueryParams).subscribe({
      next: (response) => {
        this.searchResults = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * DEPRECATED
   * @param event
   */
  /* handleSearch(event: MovieSearch) {
    this.searchResults = event;
  } */
}
