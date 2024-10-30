import { Component } from '@angular/core';
import { MovieResult, MovieSearch } from '../../models/movie';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
})
export class PeliculasComponent {
  public searchResults: MovieSearch = {
    page: -1,
    total_pages: -1,
    total_results: -1,
    results: [],
  };

  handleSearch(event: MovieSearch) {
    this.searchResults = event;
  }
}
