import { Component } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MultiQueryParams, MultiSearch } from '../../models/multi';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
})
export class HomeComponent {
  constructor(private tmdbService: TmdbService) {}

  public searchResults: MultiSearch = {
    page: -1,
    results: [],
    total_pages: -1,
    total_results: -1,
  };
  public currentPage: number = -1;

  public multiQueryParams: MultiQueryParams = {
    query: '',
  };

  handleSearch(multiQueryParams: MultiQueryParams) {
    this.multiQueryParams = multiQueryParams;
    this.tmdbService.searchMulti(this.multiQueryParams).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.searchResults.results = response.results;
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
      this.multiQueryParams.page = requestedPage;
      this.handleSearch(this.multiQueryParams);
    }
    console.log(requestedPage);
  }
}
