import { Component, Input } from '@angular/core';
import { MovieOut } from '../../services/api';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCard {
  @Input() movie!: MovieOut;

  getRating(): string {
    return this.movie.rating ? this.movie.rating.toFixed(1) : 'N/A';
  }

  getDuration(): string {
    return this.movie.duration ? `${this.movie.duration} min` : 'N/A';
  }

  getYear(releaseDate: string): string {
    if (!releaseDate) return 'N/A';
    try {
      return new Date(releaseDate).getFullYear().toString();
    } catch {
      return releaseDate.split('-')[0] || 'N/A';
    }
  }
}
