import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-movie.html',
  styleUrl: './add-movie.css'
})
export class AddMovie {
  private api = inject(Api);
  movieAdded = output<void>();
  
  loading = false;
  error = '';
  success = '';
  
  availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi',
    'Thriller', 'Western', 'Family', 'Musical', 'War', 'History'
  ];

  movie = {
    title: '',
    description: '',
    genres: [] as string[],
    release_date: '',
    duration: 0,
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

  toggleGenre(genre: string, event: any) {
    if (event.target.checked) {
      this.movie.genres.push(genre);
    } else {
      this.movie.genres = this.movie.genres.filter(g => g !== genre);
    }
  }

  async onSubmit() {
    if (!this.movie.title || !this.movie.description || this.movie.genres.length === 0) {
      this.error = 'Please fill all required fields (title, description, and at least one genre)';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      await this.api.createMovie(this.movie);
      this.success = 'Movie added successfully!';
      this.movieAdded.emit();
      
      // Reset form after success
      setTimeout(() => {
        this.resetForm();
        this.success = '';
      }, 2000);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  resetForm() {
    this.movie = {
      title: '',
      description: '',
      genres: [],
      release_date: '',
      duration: 0,
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
    this.error = '';
    this.success = '';
  }
}