import { Component, ElementRef } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { TvResult, TvSearch, TvSearchForm } from '../../models/tv';

declare var bootstrap: any;
@Component({

  selector: 'app-series',
  templateUrl: './series.component.html',
  standalone: false,
})
export class SeriesComponent {
  constructor(private tmdbService: TmdbService, private el: ElementRef) {}

  trendingTv : TvResult[] = [];

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

  ngOnInit(): void {
    this.tmdbService.getTrendingTV().subscribe((data: any) => {
      this.trendingTv = data.results.slice(0, 10);
      this.initializeCarousel(); 
    });
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    const carouselElement = this.el.nativeElement.querySelector('#trendingCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
      });
    }
  }

  public isSearchPerformed = false;

  handleSearch(tvSearchForm: TvSearchForm) {
    this.tvSearchForm = tvSearchForm;
    this.isSearchPerformed = true;
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
