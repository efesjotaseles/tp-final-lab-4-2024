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
import {
  TvGenre,
  tvGenres,
  TvQueryParams,
  TvSearchForm,
} from '../../../models/tv';

@Component({
  selector: 'app-tv-search-bar',
  templateUrl: './tv-search-bar.component.html',
  standalone: false,
})
export class TvSearchBarComponent {
  @Output() public tvSearchFormEmitter: EventEmitter<TvSearchForm> =
    new EventEmitter<TvSearchForm>();

  public genres: TvGenre[] = tvGenres;

  public searchForm: FormGroup = new FormGroup({
    query: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    first_air_date: new FormControl(null, [
      Validators.min(1800),
      Validators.max(2100),
    ]),
    genre: new FormControl(null),
  });

  handleSubmit() {
    if (this.searchForm.valid) {
      let tvSearchForm: TvSearchForm = this.formTvSearchForm();
      this.tvSearchFormEmitter.emit(tvSearchForm);
    } else {
      alert('Datos no válidos!');
    }
  }

  private formTvSearchForm(): TvSearchForm {
    let tvQueryParams: TvQueryParams = {
      query: this.searchForm.value.query,
    };

    if (this.validFirstAirDate()) {
      tvQueryParams.first_air_date_year =
        this.searchForm.value.first_air_date.toString();
    }
    let tvSearchForm: TvSearchForm = {
      tvQueryParams: tvQueryParams,
    };
    if (this.searchForm.value.genre !== null) {
      tvSearchForm.genre = this.searchForm.value.genre;
    }
    return tvSearchForm;
  }

  public validFirstAirDate(): boolean {
    return (
      this.searchForm.value.first_air_date !== null &&
      this.searchForm.value.first_air_date !== undefined &&
      this.searchForm.get('first_air_date')?.valid === true
    );
  }
}
