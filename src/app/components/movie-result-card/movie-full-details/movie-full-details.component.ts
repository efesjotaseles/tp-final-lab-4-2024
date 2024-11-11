import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Movie } from '../../../models/movie';


@Component({
  selector: 'app-movie-full-details',
  templateUrl: './movie-full-details.component.html',
  styleUrls: ['./movie-full-details.component.css']
})
export class MovieFullDetailsComponent implements OnInit {
  public movieDetails: Movie | null = null;
  private movieId: number | null = null;
  public imgBaseUrl: string = 'https://image.tmdb.org/t/p/w500';

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id')); 

    if (this.movieId) {
      this.getMovieDetails(this.movieId); 
    }
  }

  private getMovieDetails(id: number): void {
    this.tmdbService.searchMovieById(id).subscribe((data) => {
      this.movieDetails = data; 
    });
  }
}
