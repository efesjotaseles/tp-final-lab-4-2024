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
  private tvId: number | null = null;
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
    this.loadUserRating();
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
    if (this.movieId || this.tvId) {
      // Construir el endpoint dinámico basado en el tipo (movieId o tvId)
      const filter = this.movieId ? `movieId=${this.movieId}` : `tvId=${this.tvId}`;

      // Hacer la solicitud HTTP con el filtro aplicado
      this.http.get<any[]>(`http://localhost:3000/comments?${filter}`).subscribe(
        (comments) => {
          // Filtrar los comentarios con movieId o tvId correspondiente si la API no lo hace
          const filteredComments = comments.filter(comment =>
            (this.movieId && comment.movieId === this.movieId) ||
            (this.tvId && comment.tvId === this.tvId)
          );

          // Cargar los usuarios asociados a esos comentarios
          const userRequests = filteredComments.map((comment) =>
            this.http.get<any>(`http://localhost:3000/users/${comment.userId}`).pipe(
              map((user) => ({
                ...comment,
                username: user.username // Agregar el username al comentario
              }))
            )
          );

          // Usamos forkJoin para esperar que todos los usuarios estén listos
          forkJoin(userRequests).subscribe(
            (commentsWithUsers) => {
              this.comments = commentsWithUsers; // Asignar los comentarios con usuarios
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
    if ((this.movieId || this.tvId) && this.commentForm.valid) {
      const comment = {
        userId: this.loggedInUser?.id,
        movieId: this.movieId || null, // Si no hay movieId, enviar null
        tvId: this.tvId || null,       // Si no hay tvId, enviar null
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

  loadUserRating(): void {
    if (this.movieId && this.loggedInUser) {
      this.http.get<any[]>('http://localhost:3000/ratings').subscribe(
        (ratings) => {
          // Buscar si existe un rating para este movieId y userId
          const userRating = ratings.find(
            (rating) => rating.movieId === this.movieId && rating.userId === this.loggedInUser.id
          );

          // Si existe un rating, lo ponemos en el formulario
          if (userRating) {
            this.ratingForm.patchValue({
              rating: userRating.number // Establecemos el valor del rating
            });
          }
        },
        (error) => {
          console.error('Error loading user ratings:', error);
        }
      );
    }
  }
  submitRating(): void {
    if ((this.movieId || this.tvId) && !(this.movieId && this.tvId)) {
      if (this.ratingForm.valid) {
        this.http.get<any[]>('http://localhost:3000/ratings').subscribe(
          (ratings) => {
            const existingRating = ratings.find(
              (rating) =>
                (rating.movieId === this.movieId || rating.tvId === this.tvId) &&
                rating.userId === this.loggedInUser?.id
            );
  
            const newOrUpdatedRating = {
              id: existingRating?.id || ratings.reduce((max, rating) => Math.max(max, +rating.id), 0) + 1,
              userId: this.loggedInUser?.id,
              number: this.ratingForm.value.rating,
              movieId: this.movieId || null,
              tvId: this.tvId || null
            };
  
            if (existingRating) {
              // Actualizar rating
              this.http.put(`http://localhost:3000/ratings/${existingRating.id}`, newOrUpdatedRating).subscribe(
                (response) => {
                  console.log('Rating updated:', response);
                  this.ratingForm.reset();
                  this.loadUserRating();
                },
                (error) => console.error('Error updating rating:', error)
              );
            } else {
              // Crear rating nuevo
              this.http.post('http://localhost:3000/ratings', newOrUpdatedRating).subscribe(
                (response) => {
                  console.log('New Rating created:', response);
                  this.ratingForm.reset();
                  this.loadUserRating();
                },
                (error) => console.error('Error creating new rating:', error)
              );
            }
          },
          (error) => console.error('Error loading ratings:', error)
        );
      }
    } else {
      console.error('Define solo movieId o tvId, pero no ambos');
    }
  }
}
