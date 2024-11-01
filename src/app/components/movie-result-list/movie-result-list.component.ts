import { Component, Input } from '@angular/core';
import { MovieQueryParams, MovieResult, MovieSearch } from '../../models/movie';

@Component({
  selector: 'app-movie-result-list',
  templateUrl: './movie-result-list.component.html',
})
export class MovieResultListComponent {
  @Input() movieResult: MovieSearch = {
    page: -1,
    total_pages: -1,
    total_results: -1,
    results: [],
  };
}
