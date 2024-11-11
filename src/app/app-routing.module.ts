import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/series/series.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { LoginComponent } from './auth/login/login.component';
<<<<<<< Updated upstream
import { FullDetailsComponent } from './components/full-details/full-details.component';
=======
import { TvShowFullDetailsComponent } from './components/tv-result-card/tv-show-full-details/tv-show-full-details.component';
import { MovieFullDetailsComponent } from './components/movie-result-card/movie-full-details/movie-full-details.component';
>>>>>>> Stashed changes


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'peliculas',
    component: PeliculasComponent
  },

  {
    path: 'movie-details/:id',
    component: MovieFullDetailsComponent
  },
  
  {
    path: 'peliculas/:id',
    component: FullDetailsComponent
  },
  {
    path: 'series',
    component: SeriesComponent
  },
  {
    path: 'tv-details/:id',
    component: TvShowFullDetailsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'busqueda',
    component: BusquedaComponent
  },
  {
    path: '**',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
