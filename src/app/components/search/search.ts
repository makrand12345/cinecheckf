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
  selectedYear: number | null = null;
  minRating: number | null = null;
  sortBy = 'created_at';
  
  genres: string[] = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure', 'Animation', 'Crime', 'Fantasy', 'Mystery'];
  years: number[] = [];
  sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' }
  ];

  constructor() {
    // Generate years from 2024 down to 1950
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      this.years.push(year);
    }
  }

  async ngOnInit() {
    await this.loadMovies();
  }

  async loadMovies() {
    this.loading = true;
    
    try {
      this.movies = await this.api.getMovies(
        this.searchQuery || undefined,
        this.selectedGenre || undefined,
        this.selectedYear || undefined,
        this.minRating || undefined,
        this.sortBy,
        undefined
      );
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

  clearFilters() {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedYear = null;
    this.minRating = null;
    this.sortBy = 'created_at';
    this.loadMovies();
  }

  private debounceTimer: any;
  private debounce(func: Function, delay: number) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => func(), delay);
  }
}