import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCard } from '../movie-card/movie-card';
import { Api, MovieOut } from '../../services/api';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCard],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieList implements OnInit {
  private api = inject(Api);
  private cd = inject(ChangeDetectorRef);

  movies: MovieOut[] = [];
  loading = false;
  error = '';

  async ngOnInit() {
    await this.loadMovies();
  }

  async loadMovies() {
    this.loading = true;
    this.error = '';
    this.cd.detectChanges();

    try {
      this.movies = await this.api.getMovies();
    } catch (err) {
      this.error = 'Failed to load movies. Please try again.';
      console.error('Error loading movies:', err);
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }
  }
}


