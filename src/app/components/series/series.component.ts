import { Component } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { TvSearch, TvSearchForm } from '../../models/tv';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  standalone: false,
})
export class SeriesComponent {
  constructor(private tmdbService: TmdbService) {}

  public searchResults: TvSearch = {
    page: -1,
    total_pages: -1,
    total_results: -1,
    results: [],
  };
  public currentPage: number = -1;

  public tvSearchForm: TvSearchForm = {
    tvQueryParams: {
      query: '',
    },
  };

  handleSearch(tvSearchForm: TvSearchForm) {
    this.tvSearchForm = tvSearchForm;
    this.tmdbService
      .searchTv(this.tvSearchForm.tvQueryParams)
      .subscribe({
        next: (response) => {
          //Filter before...
          if (
            tvSearchForm.genre !== null &&
            tvSearchForm.genre !== undefined
          ) {
            //console.log(typeof movieSearchForm.genre);
            response.results = response.results.filter((result) => {
              //console.log(result.genre_ids);
              return result.genre_ids.includes(Number(tvSearchForm.genre!));
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
      this.tvSearchForm.tvQueryParams.page = requestedPage;
      this.handleSearch(this.tvSearchForm);
    }
    console.log(requestedPage);
  }
}
