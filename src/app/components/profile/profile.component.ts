import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/movie';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  likedMovies: Movie[] = [];
  watchedMovies: Movie[] = [];
  watchlistMovies: Movie[] = [];
  loadingLiked: boolean = true;
  loadingWatched: boolean = true;
  loadingWatchlist: boolean = true;

  constructor(
    private authService: AuthService,
    private tmdbService: TmdbService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      if (loggedInUser.likes) {
        this.loadMovies(loggedInUser.likes, 'liked');
      }
      if (loggedInUser.watched) {
        this.loadMovies(loggedInUser.watched, 'watched');
      }
      if (loggedInUser.watchlist) {
        this.loadMovies(loggedInUser.watchlist, 'watchlist');
      }
    }
  }

  private loadMovies(movieIds: number[], type: 'liked' | 'watched' | 'watchlist'): void {
    const movieRequests = movieIds.map(id => this.tmdbService.searchMovieById(id));
    
    forkJoin(movieRequests).subscribe({
      next: (movies) => {
        const filteredMovies = movies.filter((movie): movie is Movie => movie !== undefined);
        
        if (type === 'liked') {
          this.likedMovies = filteredMovies;
          this.loadingLiked = false;
        } else if (type === 'watched') {
          this.watchedMovies = filteredMovies;
          this.loadingWatched = false;
        } else if (type === 'watchlist') {
          this.watchlistMovies = filteredMovies;
          this.loadingWatchlist = false;
        }
      },
      error: (err) => {
        console.error(`Error loading ${type} movies:`, err);

        if (type === 'liked') this.loadingLiked = false;
        else if (type === 'watched') this.loadingWatched = false;
        else if (type === 'watchlist') this.loadingWatchlist = false;
      }
    });
  }

  handleShowFullDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }
}
