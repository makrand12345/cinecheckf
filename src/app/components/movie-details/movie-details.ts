import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private api = inject(Api);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  movie: any = null;
  loading = false;
  error = '';
  selectedRating = 0;
  reviewText = '';
  movieId: string = '';

  async ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id') || '';
    if (this.movieId) {
      await this.loadMovie(this.movieId);
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

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  async submitRating() {
    if (!this.selectedRating) return;
    
    try {
      await this.api.rateMovie(this.movie._id, this.selectedRating, this.reviewText);
      await this.loadMovie(this.movie._id);
      this.selectedRating = 0;
      this.reviewText = '';
    } catch (err: any) {
      this.error = err.message;
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