import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MovieSearchBarComponent } from './components/movie-search-bar/movie-search-bar.component';
import { TvSearchBarComponent } from './components/tv-search-bar/tv-search-bar.component';
import { MultiSearchBarComponent } from './components/multi-search-bar/multi-search-bar.component';

@NgModule({
  declarations: [
    SearchBarComponent,
    MovieSearchBarComponent,
    TvSearchBarComponent,
    MultiSearchBarComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    SearchBarComponent,
    MovieSearchBarComponent,
    TvSearchBarComponent,
    MultiSearchBarComponent,
  ],
})
export class SearchModule {}
