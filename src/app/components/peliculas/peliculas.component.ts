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

  public movieQueryParams: MovieQueryParams = {
    query: ''
  }

  handleSearch(movieQueryParams: MovieQueryParams) {
    this.movieQueryParams = movieQueryParams;
    this.tmdbService.searchMovies(this.movieQueryParams).subscribe({
      next: (response) => {
        this.searchResults = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  handlePageChange(direction: number){
    let pageRequested: number = this.searchResults.page + direction;
    if(pageRequested !== 0 && pageRequested <= this.searchResults.total_pages){
      this.movieQueryParams.page = pageRequested;
      this.handleSearch(this.movieQueryParams);
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
