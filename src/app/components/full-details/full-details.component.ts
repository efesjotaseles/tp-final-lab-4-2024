import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-full-details',
  templateUrl: './full-details.component.html',
  styleUrls: ['./full-details.component.css']
})
export class FullDetailsComponent implements OnInit {
  public imgBaseUrl: string = 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2';
  public movieDetails!: Movie;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (movieId) {
      this.tmdbService.searchMovieById(movieId).subscribe((movie) => {
        this.movieDetails = movie;
      });
    }
  }

  get genreNames(): string {
    return this.movieDetails.genres.map(g => g.name).join(', ') || 'N/A';
  }
  
}
