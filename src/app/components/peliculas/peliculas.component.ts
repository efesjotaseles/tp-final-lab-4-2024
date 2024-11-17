import { TmdbService } from './../../services/tmdb.service';
import { Component, ElementRef } from '@angular/core';
import {
  Movie,
  MovieQueryParams,
  MovieResult,
  MovieSearch,
  MovieSearchForm,
} from '../../models/movie';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  standalone: false,
})
export class PeliculasComponent {
  constructor(private tmdbService: TmdbService, private el: ElementRef, private router: Router) {}

  trendingMovies: Movie[] = [];

  public searchResults: MovieSearch = {
    page: -1,
    total_pages: -1,
    total_results: -1,
    results: [],
  };
  public currentPage: number = -1;
  public isSearchPerformed: boolean = false;

  public movieSearchForm: MovieSearchForm = {
    movieQueryParams: {
      query: '',
    },
  };

  ngOnInit(): void {
    // Obtener las películas trending al cargar el componente
    this.tmdbService.getTrendingMovies().subscribe((data: any) => {
      this.trendingMovies = data.results.slice(0, 10);
      this.initializeCarousel(); // Inicializar el carrusel al obtener los datos
    });
  }

  ngAfterViewInit(): void {
    this.initializeCarousel(); // Inicializar el carrusel después de cargar la vista
  }

  private initializeCarousel(): void {
    // Obtener el elemento del carrusel por ID y crear una instancia de Bootstrap
    const carouselElement = this.el.nativeElement.querySelector('#trendingCarousel');
    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 5000, // Cambiar cada 5 segundos
        ride: 'carousel', // Para iniciar automáticamente
      });
    }
  }

  handleSearch(movieSearchForm: MovieSearchForm) {
    this.movieSearchForm = movieSearchForm;
    this.isSearchPerformed = true;

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

  handleShowFullDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  /**
   * DEPRECATED
   * @param event
   */
  /* handleSearch(event: MovieSearch) {
    this.searchResults = event;
  } */
}
