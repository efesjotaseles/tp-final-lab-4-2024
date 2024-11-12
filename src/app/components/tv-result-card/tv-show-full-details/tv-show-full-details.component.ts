// tv-show-full-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../../services/tmdb.service';
import { Tv } from '../../../models/tv';

@Component({
  selector: 'app-tv-show-full-details',
  templateUrl: './tv-show-full-details.component.html',
  styleUrls: ['./tv-show-full-details.component.css']
})
export class TvShowFullDetailsComponent implements OnInit {

  public tvDetails: Tv | null = null;
  private tvId: number | null = null;

  constructor(
    private route: ActivatedRoute, // Obtener el ID de la URL
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.tvId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.tvId) {
      this.getTvDetails(this.tvId);
    }
  }

  private getTvDetails(id: number): void {

    this.tmdbService.searchTvById(id).subscribe({
      next: (data) => {
        this.tvDetails = data;
      },
      error: (error) => {
        console.error('Error al obtener detalles de la serie:', error);
      }
    });
  }
}
