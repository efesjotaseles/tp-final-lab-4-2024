import { Component, Input } from '@angular/core';
import { MultiSearch } from '../../models/multi';
import { MultiConverterService } from '../../services/multi-converter.service';
import { MediaType } from '../../models/multi';

@Component({
  selector: 'app-multi-result-list',
  templateUrl: './multi-result-list.component.html',
  standalone: false,
})
export class MultiResultListComponent {
  constructor(private convert: MultiConverterService) {}
  public mediaType = MediaType;
  @Input() multiSearch: MultiSearch = {
    page: -1,
    results: [],
    total_pages: -1,
    total_results: -1,
  };
}
