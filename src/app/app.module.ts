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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from './search/search.module';
import { MovieResultCardComponent } from './components/movie-result-card/movie-result-card.component';
import { MovieResultListComponent } from './components/movie-result-list/movie-result-list.component';
import { NgOptimizedImage } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TvResultCardComponent } from './components/tv-result-card/tv-result-card.component';
import { TvResultListComponent } from './components/tv-result-list/tv-result-list.component';
import { MultiResultListComponent } from './components/multi-result-list/multi-result-list.component';
import { MultiConverterService } from './services/multi-converter.service';
import { MultiResultCardComponent } from './components/multi-result-card/multi-result-card.component';
import { TvShowFullDetailsComponent } from './components/tv-result-card/tv-show-full-details/tv-show-full-details.component';
import { MovieFullDetailsComponent } from './components/movie-result-card/movie-full-details/movie-full-details.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    PeliculasComponent,
    SeriesComponent,
    MovieResultCardComponent,
    MovieResultListComponent,
    PaginationComponent,
    TvResultCardComponent,
    TvResultListComponent,
    MultiResultListComponent,
    MultiResultCardComponent,
    SignUpComponent,
    ProfileComponent,
    MovieFullDetailsComponent,
    TvShowFullDetailsComponent,
    SettingsComponent,
    AdminSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SearchModule,
    NgOptimizedImage,
  ],
  providers: [
    TmdbService,
    MultiConverterService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
