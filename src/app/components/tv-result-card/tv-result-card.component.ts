import { Component, Input } from '@angular/core';
import { TvResult } from '../../models/tv';

@Component({
  selector: 'app-tv-result-card',
  templateUrl: './tv-result-card.component.html',
  standalone: false,
})
export class TvResultCardComponent {

  public imgBaseUrl: string =
    'https://media.themoviedb.org/t/p/w600_and_h900_bestv2';

  @Input() public tvResult: TvResult = {
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
    vote_count: 0
  };

  handleShowFullDetails(){
    //TODO lógica de visionado de detalles completos
    alert(this.tvResult.id);
  }

  public name: string | undefined = this.tvResult?.name;
  public imgURL: string | undefined | null = this.tvResult.poster_path;
  public overview: string | undefined = this.tvResult.overview;
}
