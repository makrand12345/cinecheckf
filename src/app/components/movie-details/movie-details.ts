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
  loading = true;
  error = '';
  selectedRating = 0;
  reviewText = '';
  movieId = '';
  currentUser: any = null;
  inWatchlist = false;
  loadingWatchlist = false;

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.movieId = params.get('id') || '';

      const savedUser = sessionStorage.getItem('cinecheck_user');
      if (savedUser) this.currentUser = JSON.parse(savedUser);

      if (!this.movieId) {
        this.error = 'No movie ID provided';
        this.loading = false;
        return;
      }

      await this.loadMovieData();
    });
  }

  async loadMovieData() {
    this.loading = true;
    this.error = '';
    this.movie = null;
    this.reviews = [];

    try {
      // Load movie first — stop if not found
      this.movie = await this.api.getMovieDetails(this.movieId);

      // Load reviews
      this.reviews = await this.api.getMovieReviews(this.movieId);

      // Watchlist check only if logged in
      if (this.currentUser) {
        const result = await this.api.checkWatchlist(
          this.currentUser.email,
          this.movieId
        );
        this.inWatchlist = result.in_watchlist;
      }

    } catch (err: any) {
      console.error('Movie load failed:', err);

      if (err.message?.includes('connect')) {
        this.error = 'Unable to connect to the server. Please try again later.';
      } else if (err.message?.includes('404') || err.message?.includes('not found')) {
        this.error = 'Movie not found.';
      } else {
        this.error = err.message || 'Failed to load movie details.';
      }

    } finally {
      this.loading = false;
    }
  }

  async toggleWatchlist() {
    if (!this.currentUser) return this.router.navigate(['/auth']);

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
    // ⭐ REQUIRED RATING CHECK
    if (!this.selectedRating || this.selectedRating < 1) {
      this.error = 'Please select a rating before submitting.';
      return;
    }

    if (!this.currentUser) return this.router.navigate(['/auth']);

    try {
      await this.api.createReview(
        this.movieId,
        this.selectedRating,
        this.reviewText,
        this.currentUser.email,
        this.currentUser.username
      );

      // Refresh data
      this.reviews = await this.api.getMovieReviews(this.movieId);
      this.movie = await this.api.getMovieDetails(this.movieId);

      // Reset form
      this.selectedRating = 0;
      this.reviewText = '';
      this.error = '';

    } catch (err: any) {
      this.error = err.message || 'Failed to submit review';
    }
  }

  getYear(releaseDate: string) {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  }

  formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString();
  }

  openTrailer() {
    if (this.movie?.trailer_url) {
      window.open(this.movie.trailer_url, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  retryLoadMovie() {
    if (this.movieId) this.loadMovieData();
  }
}
