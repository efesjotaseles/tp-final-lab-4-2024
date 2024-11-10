import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { TmdbService } from './services/tmdb.service';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';
import { SeriesComponent } from './components/series/series.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from './search/search.module';
import { MovieResultCardComponent } from './components/movie-result-card/movie-result-card.component';
import { MovieResultListComponent } from './components/movie-result-list/movie-result-list.component';
import { NgOptimizedImage } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TvResultCardComponent } from './components/tv-result-card/tv-result-card.component';
import { FullDetailsComponent } from './components/full-details/full-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    PeliculasComponent,
    SeriesComponent,
    LoginComponent,
    BusquedaComponent,
    MovieResultCardComponent,
    MovieResultListComponent,
    PaginationComponent,
    TvResultCardComponent,
    FullDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SearchModule,
    NgOptimizedImage,
  ],
  providers: [TmdbService, provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
