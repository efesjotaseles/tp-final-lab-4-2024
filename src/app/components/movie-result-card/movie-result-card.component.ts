import { Component, Input } from '@angular/core';
import { MovieResult } from '../../models/movie';
<<<<<<< Updated upstream
import { MovieSelectionService } from '../../services/selected-movie.service';
=======
>>>>>>> Stashed changes
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-result-card',
  templateUrl: './movie-result-card.component.html',
})
export class MovieResultCardComponent {
  public imgBaseUrl: string =
  'https://media.themoviedb.org/t/p/w600_and_h900_bestv2';

  @Input() public movieResult: MovieResult = {
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: -1,
    original_language: '',
    original_title: '',
    overview: '',
    popularity: -1,
    poster_path: null,
    release_date: '',
    title: '',
    video: false,
    vote_average: -1,
    vote_count: -1,
  };

<<<<<<< Updated upstream
  constructor(
    private movieSelectionService: MovieSelectionService,
    private router: Router
  ) {}

  showFullDetails(): void {
    this.movieSelectionService.selectMovie(this.movieResult);
=======
  constructor(private router: Router){}

  handleShowFullDetails(){

    this.router.navigate(['/movie-details', this.movieResult.id]);

>>>>>>> Stashed changes
  }

  // Propiedades adicionales para obtener el título y la URL de la imagen
  public movieTitle: string | undefined = this.movieResult?.title;
  public imgURL: string | undefined | null = this.movieResult.poster_path
    ? `${this.imgBaseUrl}${this.movieResult.poster_path}`
    : null;
  public movieOverview: string | undefined = this.movieResult.overview;
}
