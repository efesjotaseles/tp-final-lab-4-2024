import { Component, ElementRef } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MultiQueryParams, MultiSearch } from '../../models/multi';
import { Movie } from '../../models/movie';
import { TvResult, TvSearch, TvSearchForm } from '../../models/tv';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false,
})
export class HomeComponent {
  constructor(private tmdbService: TmdbService, private el: ElementRef, private router: Router) {}

  trendingMovies: Movie[] = [];
  trendingTv: TvResult[] = [];

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

  public tvSearchForm: TvSearchForm = {
    tvQueryParams: {
      query: '',
    },
  };

  public isSearchPerformed = false;

  ngOnInit(): void {
    this.tmdbService.getTrendingMovies().subscribe((data: any) => {
      this.trendingMovies = data.results.slice(0, 10);
      this.initializeCarousel('trendingMoviesCarousel');
    });

    this.tmdbService.getTrendingTV().subscribe((data: any) => {
      this.trendingTv = data.results.slice(0, 10);
      this.initializeCarousel('trendingTvCarousel');
    });
  }

  ngAfterViewInit(): void {
    this.initializeCarousel('trendingMoviesCarousel');
    this.initializeCarousel('trendingTvCarousel');
  }

  private initializeCarousel(carouselId: string): void {
    const carouselElement = this.el.nativeElement.querySelector(`#${carouselId}`);
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        ride: 'carousel',
      });
    }
  }

  handleSearch(multiQueryParams: MultiQueryParams) {
    this.multiQueryParams = multiQueryParams;
    this.isSearchPerformed = true;
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

  handleShowFullDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  handleShowFullDetailsTv(tvId: number): void {
    
    this.router.navigate(['/tv-details', tvId]);
  }
}
