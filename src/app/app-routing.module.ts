import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/series/series.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { LoginComponent } from './auth/login/login.component';
import { TvShowFullDetailsComponent } from './components/tv-result-card/tv-show-full-details/tv-show-full-details.component';
import { MovieFullDetailsComponent } from './components/movie-result-card/movie-full-details/movie-full-details.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';


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
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
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
