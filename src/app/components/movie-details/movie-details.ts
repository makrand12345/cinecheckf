import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private api = inject(Api);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  movie: any = null;
  reviews: any[] = [];
  loading = false;
  error = '';
  selectedRating = 0;
  reviewText = '';
  movieId: string = '';
  currentUser: any = null;
  inWatchlist = false;
  loadingWatchlist = false;

  async ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id') || '';
    const savedUser = sessionStorage.getItem('cinecheck_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
    
    if (this.movieId) {
      await this.loadMovie(this.movieId);
      await this.loadReviews();
      if (this.currentUser) {
        await this.checkWatchlistStatus();
      }
    }
  }

  async loadMovie(movieId: string) {
    this.loading = true;
    this.error = '';
    
    try {
      this.movie = await this.api.getMovieDetails(movieId);
    } catch (err) {
      this.error = 'Failed to load movie details. Please try again.';
      console.error('Error loading movie:', err);
    } finally {
      this.loading = false;
    }
  }

  async loadReviews() {
    try {
      this.reviews = await this.api.getMovieReviews(this.movieId);
    } catch (err) {
      console.error('Error loading reviews:', err);
      this.reviews = [];
    }
  }

  async checkWatchlistStatus() {
    if (!this.currentUser) return;
    try {
      const result = await this.api.checkWatchlist(this.currentUser.email, this.movieId);
      this.inWatchlist = result.in_watchlist;
    } catch (err) {
      console.error('Error checking watchlist:', err);
    }
  }

  async toggleWatchlist() {
    if (!this.currentUser) {
      this.router.navigate(['/auth']);
      return;
    }
    
    this.loadingWatchlist = true;
    try {
      if (this.inWatchlist) {
        await this.api.removeFromWatchlist(this.currentUser.email, this.movieId);
        this.inWatchlist = false;
      } else {
        await this.api.addToWatchlist(this.currentUser.email, this.movieId);
        this.inWatchlist = true;
      }
    } catch (err: any) {
      this.error = err.message || 'Failed to update watchlist';
    } finally {
      this.loadingWatchlist = false;
    }
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  async submitRating() {
    if (!this.selectedRating) return;
    if (!this.currentUser) {
      this.router.navigate(['/auth']);
      return;
    }
    
    try {
      await this.api.createReview(
        this.movieId, 
        this.selectedRating, 
        this.reviewText,
        this.currentUser.email,
        this.currentUser.username
      );
      await this.loadReviews();
      await this.loadMovie(this.movieId); // Reload to update rating
      this.selectedRating = 0;
      this.reviewText = '';
      this.error = '';
    } catch (err: any) {
      this.error = err.message || 'Failed to submit review';
    }
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  openTrailer() {
    if (this.movie.trailer_url) {
      window.open(this.movie.trailer_url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Add this method for the retry button
  retryLoadMovie() {
    if (this.movieId) {
      this.loadMovie(this.movieId);
    }
  }
}