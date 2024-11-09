import { TvSearch } from './../../models/tv';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tv-result-list',
  templateUrl: './tv-result-list.component.html',
  standalone: false,
})
export class TvResultListComponent {
  @Input() tvSearch: TvSearch = {
    page: -1,
    results: [],
    total_pages: -1,
    total_results: -1,
  };
}
