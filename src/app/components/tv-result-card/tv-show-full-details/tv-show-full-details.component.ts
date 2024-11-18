import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Tv } from '../../../models/tv';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { map, forkJoin } from 'rxjs';


@Component({
  selector: 'app-tv-show-full-details',
  templateUrl: './tv-show-full-details.component.html',
  styleUrls: ['./tv-show-full-details.component.css']
})
export class TvShowFullDetailsComponent implements OnInit {
  public tvDetails: Tv | null = null;
  private tvId: number | null = null;
  private movieId: number | null = null;
  public genres: string[] = [];
  loggedInUser: any;
  commentForm = new FormGroup({
    text: new FormControl('')
  });
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute, // Obtener el ID de la URL
    private tmdbService: TmdbService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.tvId = Number(this.route.snapshot.paramMap.get('id'));
    this.loggedInUser = this.authService.getLoggedInUser();
    this.loadComments();
    if (this.tvId) {
      this.getTvDetails(this.tvId);
    }
  }

  private getTvDetails(id: number): void {
    this.tmdbService.searchTvById(id).subscribe((data) => {
      this.tvDetails = data;
      this.genres = data.genres.map(genre => genre.name);
    });
  }

  /////////////////////////////////////////
  isLiked(): boolean {
    return this.loggedInUser?.likes.includes(this.tvId);
  }

  toggleLike(): void {
    if (this.tvId) {
      const index = this.loggedInUser.likes.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.tvId === this.tvId
      );
      if (index === -1) {
        this.loggedInUser.likes.push({ movieId: null, tvId: this.tvId }); // Agrega a la lista de me gusta
      } else {
        this.loggedInUser.likes.splice(index, 1); // Elimina de la lista de me gusta
      }
      this.updateUserData();
    }
  }

  isWatchlist(): boolean {
    return this.loggedInUser?.watchlist.includes(this.tvId);
  }

  toggleWatchlist(): void {
    if (this.tvId) {
      const index = this.loggedInUser.watchlist.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.tvId === this.tvId
      );
      if (index === -1) {
        this.loggedInUser.watchlist.push({ movieId: null, tvId: this.tvId });// Agrega a la lista de me gusta
      } else {
        this.loggedInUser.watchlist.splice(index, 1); // Elimina de la lista de me gusta
      }
      this.updateUserData();
    }
  }

  isWatched(): boolean {
    return this.loggedInUser?.watched.includes(this.tvId);
  }

  toggleWatched(): void {
    if (this.tvId) {
      const index = this.loggedInUser.watched.findIndex(
        (item: { movieId?: number; tvId?: number }) =>
          item.tvId === this.tvId
      );
      if (index === -1) {
        this.loggedInUser.watched.push({ movieId: null, tvId: this.tvId });
        // Agrega a la lista de me gusta
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
    
}