import { TmdbService } from './../../../services/tmdb.service';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MovieSearch } from '../../../models/movie';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  constructor(private tmdbService: TmdbService) {}

  @Output() public resultsEmmiter: EventEmitter<MovieSearch> =
    new EventEmitter<MovieSearch>();

  public searchForm: FormGroup = new FormGroup({
    query: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    release_date: new FormControl(undefined, [
      Validators.min(1800),
      Validators.max(2100),
    ]),
  });

  handleSubmit() {
    console.log(this.searchForm.value);
    if (this.searchForm.valid) {
      this.tmdbService
        .searchMovies({ query: this.searchForm.value.query })
        .subscribe({
          next: (response) => {
            console.log(response);
            this.resultsEmmiter.emit(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      alert('Datos no válidos!');
    }
  }
}
