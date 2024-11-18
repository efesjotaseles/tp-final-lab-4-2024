// tv-show-full-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Tv } from '../../../models/tv';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tv-show-full-details',
  templateUrl: './tv-show-full-details.component.html',
  styleUrls: ['./tv-show-full-details.component.css']
})
export class TvShowFullDetailsComponent implements OnInit {

  public tvDetails: Tv | null = null;
  private tvId: number | null = null;
  public genres: string[] = [];
  loggedInUser: any;
  commentForm = new FormGroup({
    text: new FormControl('')
  });
  ratingForm = new FormGroup({
    rating: new FormControl('') // Campo para la calificación
  });

  constructor(
    private route: ActivatedRoute, // Obtener el ID de la URL
    private tmdbService: TmdbService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.tvId = Number(this.route.snapshot.paramMap.get('id'));
    this.loggedInUser = this.authService.getLoggedInUser();
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
        (item: { tvId?: number; seriesId?: number }) => 
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
        (item: { tvId?: number; seriesId?: number }) => 
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
        (item: { tvId?: number; seriesId?: number }) => 
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

  submitComment(): void {
    if (this.tvId && this.commentForm.valid) {
      const comment = {
        userId: this.loggedInUser?.id,
        tvId: this.tvId,
        text: this.commentForm.value.text,
        date: new Date().toISOString()
      };

      this.http.post('http://localhost:3000/comments', comment).subscribe(
        (response) => {
          console.log('Comment submitted:', response);
          this.commentForm.reset();
        },
        (error) => {
          console.error('Error submitting comment:', error);
        }
      );
    }
  }

  submitRating(): void {
    if (this.tvId && this.ratingForm.valid) {
      const rating = {
        userId: this.loggedInUser?.id,
        tvId: this.tvId,
        number: this.ratingForm.value
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
    }
  }
}