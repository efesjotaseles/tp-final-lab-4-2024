import {
  MovieGenre,
  movieGenres,
  MovieSearchForm,
} from './../../../models/movie';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MovieQueryParams } from '../../../models/movie';

@Component({
  selector: 'app-movie-search-bar',
  templateUrl: './movie-search-bar.component.html',
  standalone: false,
})
export class MovieSearchBarComponent {
  @Output() public movieSearchFormEmitter: EventEmitter<MovieSearchForm> =
    new EventEmitter<MovieSearchForm>();

  public genres: MovieGenre[] = movieGenres;

  public searchForm: FormGroup = new FormGroup({
    query: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    primary_release_year: new FormControl(null, [
      Validators.min(1800),
      Validators.max(2100),
    ]),
    genre: new FormControl(null),
  });

  handleSubmit() {
    if (this.searchForm.valid) {
      let movieSearchForm: MovieSearchForm = this.formMovieSearchForm();
      this.movieSearchFormEmitter.emit(movieSearchForm);
    } else {
      alert('Datos no válidos!');
    }
  }

  private formMovieSearchForm(): MovieSearchForm {
    let movieQueryParams: MovieQueryParams = {
      query: this.searchForm.value.query,
    };

    if (this.validPrimaryReleaseYear()) {
      movieQueryParams.primary_release_year =
        this.searchForm.value.primary_release_year.toString();
    }
    let movieSearchForm: MovieSearchForm = {
      movieQueryParams: movieQueryParams,
    };
    if (this.searchForm.value.genre !== null) {
      movieSearchForm.genre = this.searchForm.value.genre;
    }
    return movieSearchForm;
  }

  public validPrimaryReleaseYear(): boolean {
    return (
      this.searchForm.value.primary_release_year !== null &&
      this.searchForm.value.primary_release_year !== undefined &&
      this.searchForm.get('primary_release_year')?.valid === true
    );
  }
}
