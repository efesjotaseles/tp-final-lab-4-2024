import { Component, EventEmitter, Output } from '@angular/core';
import { MultiQueryParams } from '../../../models/multi';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-multi-search-bar',
  templateUrl: './multi-search-bar.component.html',
  standalone: false,
})
export class MultiSearchBarComponent {
  @Output() public multiSearchFormEmitter: EventEmitter<MultiQueryParams> =
    new EventEmitter<MultiQueryParams>();

  public searchForm: FormGroup = new FormGroup({
    query: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  handleSubmit() {
    if (this.searchForm.valid) {
      let multiQueryParams: MultiQueryParams = {
        query: this.searchForm.value.query,
      };
      this.multiSearchFormEmitter.emit(multiQueryParams);
    } else {
      alert('Datos no válidos!');
    }
  }
}
