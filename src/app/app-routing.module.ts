import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { HomeComponent } from './components/home/home.component';
import { SeriesComponent } from './components/series/series.component';
import { LoginComponent } from './components/login/login.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';


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
    path: 'series',
    component: SeriesComponent
  },
  {
    path: 'iniciar-sesion',
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
