import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Movie } from '../../../models/movie';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-movie-full-details',
  templateUrl: './movie-full-details.component.html',
  styleUrls: ['./movie-full-details.component.css']
})
export class MovieFullDetailsComponent implements OnInit {
  public movieDetails: Movie | null = null;
  private movieId: number | null = null;
  public imgBaseUrl: string = 'https://image.tmdb.org/t/p/w500';
  public genres: string[] = [];
  loggedInUser: any;
  commentForm = new FormGroup({
    text: new FormControl('')
  });
  ratingForm = new FormGroup({
    rating: new FormControl('') // Campo para la calificación
  });

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.movieId) {
      this.getMovieDetails(this.movieId);
    }
  }

  private getMovieDetails(id: number): void {
    this.tmdbService.searchMovieById(id).subscribe((data) => {
      this.movieDetails = data;
      this.genres = data.genres.map(genre => genre.name);
    });
  }

  // addToLikes(): void {
  //   if (this.loggedInUser && this.movieId) {
  //     this.loggedInUser.likes.push(this.movieId);
  //     this.updateUserData();
  //   }
  // }

  isLiked(): boolean {
    return this.loggedInUser?.likes.includes(this.movieId);
  }

  toggleLike(): void {
    if (this.movieId) {
      const index = this.loggedInUser.likes.indexOf(this.movieId);
      if (index === -1) {
        this.loggedInUser.likes.push(this.movieId); // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.likes.splice(index, 1); // Elimina de la lista de me gusta
      }
      this.updateUserData();
    }
  }

  isWatchlist(): boolean {
    return this.loggedInUser?.watchlist.includes(this.movieId);
  }

  toggleWatchlist(): void {
    if (this.movieId) {
      const index = this.loggedInUser.watchlist.indexOf(this.movieId);
      if (index === -1) {
        this.loggedInUser.watchlist.push(this.movieId); // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.watchlist.splice(index, 1); // Elimina de la lista de me gusta
      }
      this.updateUserData();
    }
  }

  isWatched(): boolean {
    return this.loggedInUser?.watched.includes(this.movieId);
  }

  toggleWatched(): void {
    if (this.movieId) {
      const index = this.loggedInUser.watched.indexOf(this.movieId);
      if (index === -1) {
        this.loggedInUser.watched.push(this.movieId); // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.watched.splice(index, 1); // Elimina de la lista de me gusta
      }
      this.updateUserData();
    }
  }

  private updateUserData(): void {
    this.http
      .put(`http://localhost:3000/users/${this.loggedInUser.id}`, this.loggedInUser)
      .subscribe((updatedUser) => {
        console.log('User updated:', updatedUser);
        this.authService.updateLoggedInUser(updatedUser);
      });
  }

  submitComment() {
    const userData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userId = userData.id; 
    const movieId = this.movieId; 
    const text = this.commentForm.get('text')?.value;

    if (userId && text && movieId !== null) {
      const currentComments = this.authService.getCurrentComments(userId);
      const nextCommentId = currentComments.length > 0
        ? Math.max(...currentComments.map(comment => parseInt(comment.id, 10) || 0)) + 1
        : 1;

      const comment: any = {
        id: nextCommentId,
        movieId: Number(movieId),
        text,
        date: new Date().toISOString()
      };

      this.authService.addComment(userId, comment).subscribe(
        response => {
          console.log('Comentario guardado:', response);
        },
        error => {
          console.error('Error al guardar el comentario:', error);
        }
      );
    } else {
      console.error('Faltan datos para enviar el comentario');
    }
  }

  submitRating() {
    
    const userData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const userId = userData.id;
    const movieId = this.movieId;
    const ratingNumber = this.ratingForm.get('rating')?.value;


    if (userId && movieId !== null) {
      const currentRatings = this.authService.getCurrentRatings(userId);
      const nextRatingId = currentRatings.length > 0
        ? Math.max(...currentRatings.map(rating => parseInt(rating.id, 10) || 0)) + 1
        : 1;
      const rating: any = {
        id: nextRatingId, // Genera un ID único para la calificación
        movieId: Number(movieId),
        number: ratingNumber, // Asegúrate de que el número sea un tipo number
      };

      this.authService.addRating(userId, rating).subscribe(
        (updatedUser) => {
          console.log('Rating guardado:', updatedUser);
          this.authService.updateLoggedInUser(updatedUser);
        },
        (error) => {
          console.error('Error al guardar el rating:', error);
        }
      );
    } else {
      console.error('Faltan datos para enviar el rating');
    } 
  }
}
