import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Movie } from '../../../models/movie';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { map, forkJoin } from 'rxjs';

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
    rating: new FormControl('') 
  });
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadComments();
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

  isLiked(): boolean {
    return this.loggedInUser?.likes.includes(this.movieId);
  }

  toggleLike(): void {
    if (this.movieId) {
      const index = this.loggedInUser.likes.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.movieId === this.movieId
      );
      if (index === -1) {
        this.loggedInUser.likes.push({ movieId: this.movieId, tvId: null }); // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.likes.splice(index, 1); 
      }
      this.updateUserData();
    }
  }

  isWatchlist(): boolean {
    return this.loggedInUser?.watchlist.includes(this.movieId);
  }

  toggleWatchlist(): void {
    if (this.movieId) {
      const index = this.loggedInUser.watchlist.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.movieId === this.movieId
      );
      if (index === -1) {
        this.loggedInUser.watchlist.push({ movieId: this.movieId, tvId: null });// Agrega a la lista de me gusta
      } else {
        this.loggedInUser.watchlist.splice(index, 1); 
      }
      this.updateUserData();
    }
  }

  isWatched(): boolean {
    return this.loggedInUser?.watched.includes(this.movieId);
  }

  toggleWatched(): void {
    if (this.movieId) {
      const index = this.loggedInUser.watched.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.movieId === this.movieId
      );
      if (index === -1) {
        this.loggedInUser.watched.push({ movieId: this.movieId, tvId: null });
        // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.watched.splice(index, 1); 
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

  loadComments(): void {
    if (this.movieId) {
      this.http.get<any[]>(`http://localhost:3000/comments?movieId=${this.movieId}`).subscribe(
        (comments) => {
          const userRequests = comments.map((comment) =>
            this.http.get<any>(`http://localhost:3000/users/${comment.userId}`).pipe(
              map((user) => ({
                ...comment,
                username: user.username // Agrega el username al comentario
              }))
            )
          );

          forkJoin(userRequests).subscribe(
            (commentsWithUsers) => {
              this.comments = commentsWithUsers;
            },
            (error) => {
              console.error('Error loading users for comments:', error);
            }
          );
        },
        (error) => {
          console.error('Error loading comments:', error);
        }
      );
    }
  }
  submitComment(): void {
    if (this.movieId && this.commentForm.valid) {
      const comment = {
        userId: this.loggedInUser?.id,
        movieId: this.movieId,
        text: this.commentForm.value.text,
        date: new Date().toISOString()
      };

      this.http.post('http://localhost:3000/comments', comment).subscribe(
        (response) => {
          console.log('Comment submitted:', response);
          this.commentForm.reset();
          this.loadComments();
        },
        (error) => {
          console.error('Error submitting comment:', error);
        }
      );
    }
  }



  submitRating(): void {
    if (this.movieId && this.ratingForm.valid) {
      this.http.get<any[]>('http://localhost:3000/ratings').subscribe(
        (ratings) => {
          // Obtener el mayor id existente y sumar 1
          const maxId = ratings.reduce((max, rating) => (rating.id > max ? rating.id : max), 0);

          // Crear el nuevo rating
          const rating = {
            id: maxId + 1, // Incrementar el id en base decimal
            userId: this.loggedInUser?.id,
            movieId: this.movieId,
            number: this.ratingForm.value.rating // Guarda el número directamente
          };

          this.http.post('http://localhost:3000/ratings', rating).subscribe(
            (response) => {
              console.log('Rating submitted:', response);
              this.ratingForm.reset();
            },
            (error) => {
              console.error('Error submitting rating:', error);
            }
          );
        },
        (error) => {
          console.error('Error loading ratings:', error);
        }
      );
    }
  }
}
