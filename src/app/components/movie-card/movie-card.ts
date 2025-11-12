import { Component, Input } from '@angular/core';
import { MovieOut } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
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
}
