import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieCard } from '../movie-card/movie-card';
import { Api } from '../../services/api';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCard],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {
  private api = inject(Api);
  
  movies: any[] = [];
  loading = false;
  searchQuery = '';
  selectedGenre = '';
  genres: string[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'];

  async ngOnInit() {
    await this.loadMovies();
  }

  async loadMovies() {
    this.loading = true;
    
    try {
      this.movies = await this.api.getMovies(this.searchQuery, this.selectedGenre);
    } catch (err) {
      console.error('Error searching movies:', err);
    } finally {
      this.loading = false;
    }
  }

  onSearch() {
    this.debounce(() => this.loadMovies(), 300);
  }

  onFilter() {
    this.loadMovies();
  }

  private debounceTimer: any;
  private debounce(func: Function, delay: number) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => func(), delay);
  }
}