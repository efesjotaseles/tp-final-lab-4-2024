import { Injectable } from '@angular/core';
import { MovieResult } from '../models/movie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieSelectionService {
  private selectedMovie = new BehaviorSubject<MovieResult | null>(null);
  selectedMovie$ = this.selectedMovie.asObservable();

  selectMovie(movie: MovieResult): void {
    this.selectedMovie.next(movie);
  }
}
