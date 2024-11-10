import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/series/series.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { LoginComponent } from './auth/login/login.component';
import { FullDetailsComponent } from './components/full-details/full-details.component';


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
    path: 'peliculas/:id',
    component: FullDetailsComponent
  },
  {
    path: 'series',
    component: SeriesComponent
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
