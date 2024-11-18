import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/movie';
import { forkJoin } from 'rxjs';
import { Tv } from '../../models/tv';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  likedMovies: Movie[] = [];
  watchedMovies: Movie[] = [];
  watchlistMovies: Movie[] = [];
  likedTvShows: Tv[] = [];
  watchedTvShows: Tv[] = [];
  watchlistTvShows: Tv[] = [];
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
        this.loadTv(loggedInUser.likes, 'liked');
      }
      if (loggedInUser.watched) {
        this.loadMovies(loggedInUser.watched, 'watched');
        this.loadTv(loggedInUser.watched, 'watched');
      }
      if (loggedInUser.watchlist) {
        this.loadMovies(loggedInUser.watchlist, 'watchlist');
        this.loadTv(loggedInUser.watchlist, 'watchlist');
      }
    }
  }

  private loadMovies(movieData: { movieId: number, tvId: number | null }[], type: 'liked' | 'watched' | 'watchlist'): void {
    // Extraer solo los movieIds de los datos
    const validMovieIds = movieData.filter(item => item.movieId !== null).map(item => item.movieId!);

    // Realizar las solicitudes para obtener las películas por ID
    const movieRequests = validMovieIds.map(id => this.tmdbService.searchMovieById(id));
    
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

  private loadTv(tvData: { movieId: number | null, tvId: number }[], type: 'liked' | 'watched' | 'watchlist'): void {
    // Extraer solo los tvIds de los datos donde tvId no es null
    const tvIds = tvData.filter(data => data.tvId !== null).map(data => data.tvId!); // Aseguramos que tvId no sea null
    
    // Realizar las solicitudes para obtener las series por tvId
    const tvRequests = tvIds.map(id => this.tmdbService.searchTvById(id));
    
    forkJoin(tvRequests).subscribe({
      next: (tvShows) => {
        const filteredTvShows = tvShows.filter((tvShow): tvShow is Tv => tvShow !== undefined);
        
        if (type === 'liked') {
          this.likedTvShows = filteredTvShows;
          this.loadingLiked = false;
        } else if (type === 'watched') {
          this.watchedTvShows = filteredTvShows;
          this.loadingWatched = false;
        } else if (type === 'watchlist') {
          this.watchlistTvShows = filteredTvShows;
          this.loadingWatchlist = false;
        }
      },
      error: (err) => {
        console.error(`Error loading ${type} TV shows:`, err);
  
        if (type === 'liked') this.loadingLiked = false;
        else if (type === 'watched') this.loadingWatched = false;
        else if (type === 'watchlist') this.loadingWatchlist = false;
      }
    });
  }

  handleShowFullDetails(movieId: number): void {
    this.router.navigate(['/movie-details', movieId]);
  }

  handleShowFullDetailsTv(tvId: number): void {
    this.router.navigate(['/tv-details', tvId]);
  }
}
