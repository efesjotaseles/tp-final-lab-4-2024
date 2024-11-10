import { Component, OnInit } from '@angular/core';
import { MovieSelectionService } from '../../services/selected-movie.service';
import { MovieResult } from '../../models/movie';

@Component({
  selector: 'app-full-details',
  templateUrl: './full-details.component.html',
})
export class FullDetailsComponent implements OnInit {
  public imgBaseUrl: string = 'https://media.themoviedb.org/t/p/w600_and_h900_bestv2';
  public movieDetails!: MovieResult;

  constructor(private movieSelectionService: MovieSelectionService) {}

  ngOnInit(): void {
    this.movieSelectionService.selectedMovie$.subscribe((movie) => {
      if (movie) {
        this.movieDetails = movie;
      } else {
        console.error('No hay película seleccionada.');
      }
    });
  }

}
