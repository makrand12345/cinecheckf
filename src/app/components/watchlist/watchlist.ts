import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCard } from '../movie-card/movie-card';
import { Api, MovieOut } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, MovieCard],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css'
})
export class Watchlist implements OnInit {
  private api = inject(Api);
  router = inject(Router);
  
  movies: MovieOut[] = [];
  loading = false;
  error = '';
  currentUser: any = null;

  async ngOnInit() {
    const savedUser = sessionStorage.getItem('cinecheck_user');
    if (!savedUser) {
      this.router.navigate(['/auth']);
      return;
    }
    
    this.currentUser = JSON.parse(savedUser);
    await this.loadWatchlist();
  }

  async loadWatchlist() {
    if (!this.currentUser) return;
    
    this.loading = true;
    this.error = '';
    
    try {
      this.movies = await this.api.getWatchlist(this.currentUser.email);
    } catch (err: any) {
      this.error = err.message || 'Failed to load watchlist';
      console.error('Error loading watchlist:', err);
    } finally {
      this.loading = false;
    }
  }
}

