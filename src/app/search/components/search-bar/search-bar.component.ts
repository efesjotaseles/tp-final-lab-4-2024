import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MovieQueryParams } from '../../../models/movie';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  constructor() {}

  @Output() public movieQueryParamsEmitter: EventEmitter<MovieQueryParams> =
    new EventEmitter<MovieQueryParams>();

  public searchForm: FormGroup = new FormGroup({
    query: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
    primary_release_year: new FormControl(null, [
      Validators.min(1800),
      Validators.max(2100),
    ]),
  });

  handleSubmit() {
    if (this.searchForm.valid) {
      let movieQueryParams: MovieQueryParams = this.formQueryParams();
      this.movieQueryParamsEmitter.emit(movieQueryParams);
    } else {
      alert('Datos no válidos!');
    }
  }

  private formQueryParams(): MovieQueryParams {
    let movieQueryParams: MovieQueryParams = {
      query: this.searchForm.value.query,
    };
    if (this.validPrimaryReleaseYear()) {
      movieQueryParams.primary_release_year =
        this.searchForm.value.primary_release_year.toString();
    }
    return movieQueryParams;
  }

  public validPrimaryReleaseYear(): boolean {
    return (
      this.searchForm.value.primary_release_year !== null &&
      this.searchForm.value.primary_release_year !== undefined &&
      this.searchForm.get('primary_release_year')?.valid === true
    );
  }
}
