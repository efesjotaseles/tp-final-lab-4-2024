import { Component } from '@angular/core';
import { TmdbService } from './services/tmdb.service';
import { MovieSearch, MovieQueryParams } from './models/movie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private tmdbService: TmdbService) {}

  private movieSearch: MovieSearch = {
    page: -1,
    results: [],
    total_pages: -1,
    total_results: -1,
  };

  ngOnInit() {
    /* this.tmdbService.searchMovies({ query: 'man', page: 15 }).subscribe(
      (response) => {
        this.movieSearch = response;
        console.log(this.movieSearch);
      },
      (error) => {
        console.log(error);
      }
    ); */
  }
}
