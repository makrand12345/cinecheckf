import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-submit-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submit-movie.html',
  styleUrl: './submit-movie.css'
})
export class SubmitMovie {
  private api = inject(Api);
  
  movieData: any = {
    title: '',
    description: '',
    genres: [],
    release_date: '',
    duration: null,
    poster_url: '',
    trailer_url: '',
    director: '',
    language: '',
    country: '',
    age_rating: '',
    image_gallery: [],
    cast: [],
    is_featured: false
  };

  availableGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Fantasy', 'Mystery', 'Adventure'];
  submitting = false;
  error = '';
  success = '';

  toggleGenre(genre: string, event: any) {
    if (event.target.checked) {
      this.movieData.genres.push(genre);
    } else {
      this.movieData.genres = this.movieData.genres.filter((g: string) => g !== genre);
    }
  }

  async submitMovie() {
    this.submitting = true;
    this.error = '';
    this.success = '';

    try {
      await this.api.createMovie(this.movieData);
      this.success = 'Movie submitted successfully! It will be reviewed by an admin.';
      this.resetForm();
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.submitting = false;
    }
  }

  resetForm() {
    this.movieData = {
      title: '',
      description: '',
      genres: [],
      release_date: '',
      duration: null,
      poster_url: '',
      trailer_url: '',
      director: '',
      language: '',
      country: '',
      age_rating: '',
      image_gallery: [],
      cast: [],
      is_featured: false
    };
  }
}