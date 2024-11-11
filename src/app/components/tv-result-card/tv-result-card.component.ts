<<<<<<< Updated upstream
import { Component } from '@angular/core';
=======
import { Component, Input } from '@angular/core';
import { TvResult } from '../../models/tv';
import { Router } from '@angular/router';
>>>>>>> Stashed changes

@Component({
  selector: 'app-tv-result-card',
  templateUrl: './tv-result-card.component.html',
})
<<<<<<< HEAD
<<<<<<< Updated upstream
export class TvResultCardComponent {}
=======
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

  constructor(private router: Router) {}

  handleShowFullDetails(): void {
    
    this.router.navigate(['/tv-details', this.tvResult.id]);
  }

  public name: string | undefined = this.tvResult?.name;
  public imgURL: string | undefined | null = this.tvResult.poster_path;
  public overview: string | undefined = this.tvResult.overview;
}
>>>>>>> Stashed changes
=======
export class TvResultCardComponent {

}
>>>>>>> parent of 12cdac5 (Agragada la propiedad de standalone seteada en false a todos los componentes)
