import { Component, Input, SimpleChanges } from '@angular/core';
import { MediaType, MultiResult } from '../../models/multi';
import { MultiConverterService } from '../../services/multi-converter.service';
import { MovieResult } from '../../models/movie';
import { TvResult } from '../../models/tv';

@Component({
  selector: 'app-multi-result-card',
  templateUrl: './multi-result-card.component.html',
  standalone: false,
})
export class MultiResultCardComponent {
  constructor(private convert: MultiConverterService) {}

  @Input() multiResult: MultiResult = {
    id: 0,
    media_type: null,
    adult: false,
    popularity: 0,
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['multiResult'] && changes['multiResult'].currentValue) {
      this.updateResult(changes['multiResult'].currentValue);
    }
  }

  private updateResult(newResult: MultiResult): void {
    switch (newResult.media_type) {
      case MediaType.Movie:
        this.movieResult = this.convert.toMovieResult(this.multiResult);
        break;
      case MediaType.Tv:
        this.tvResult = this.convert.toTvResult(this.multiResult);
        break;
    }
  }

  public mediaType = MediaType;
  public movieResult: MovieResult = {
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: 0,
    original_language: null,
    original_title: '',
    overview: '',
    popularity: 0,
    poster_path: null,
    release_date: '',
    title: '',
    video: false,
    vote_average: 0,
    vote_count: 0,
  };
  public tvResult: TvResult = {
    adult: false,
    backdrop_path: null,
    genre_ids: [],
    id: 0,
    origin_country: [],
    original_language: null,
    original_name: '',
    overview: '',
    popularity: 0,
    poster_path: null,
    first_air_date: '',
    name: '',
    vote_average: 0,
    vote_count: 0,
  };
}
