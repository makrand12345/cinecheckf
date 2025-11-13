import { Injectable } from '@angular/core';

export interface CastMember {
  name: string;
  role: string;
}

export interface RatingOut {
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

export interface MovieOut {
  id: string;
  title: string;
  description: string;
  genres: string[];
  release_date?: string;
  duration?: number;
  poster_url?: string;
  trailer_url?: string;
  director?: string;
  cast: CastMember[];
  language?: string;
  country?: string;
  age_rating?: string;
  rating?: number;
  submitted_by?: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class Api {
private apiUrl = 'https://cinecheckb.onrender.com/api/v1';

  // ===== AUTH =====
  async signup(userData: any): Promise<any> {
    const res = await fetch(`${this.apiUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to create user');
    }
    
    return await res.json();
  }

  async login(loginData: any): Promise<any> {
    const res = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.detail || 'Invalid credentials');
    }
    
    return await res.json();
  }

  // ===== MOVIES =====
  async getMovies(search?: string, genre?: string): Promise<MovieOut[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);

    const url = `${this.apiUrl}/movies${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch movies');
    return await res.json();
  }

  async getMovieDetails(movieId: string): Promise<MovieOut> {
    const res = await fetch(`${this.apiUrl}/movies/${movieId}`);
    if (!res.ok) throw new Error('Failed to fetch movie details');
    return await res.json();
  }

  async createMovie(movie: Partial<MovieOut>): Promise<MovieOut> {
    const res = await fetch(`${this.apiUrl}/movies/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    if (!res.ok) throw new Error('Failed to create movie');
    return await res.json();
  }

  async rateMovie(movieId: string, rating: number, review?: string): Promise<RatingOut> {
    const res = await fetch(`${this.apiUrl}/movies/${movieId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, review }),
    });
    if (!res.ok) throw new Error('Failed to rate movie');
    return await res.json();
  }

  async getMovieRatings(movieId: string): Promise<RatingOut[]> {
    const res = await fetch(`${this.apiUrl}/movies/${movieId}/ratings`);
    if (!res.ok) throw new Error('Failed to fetch ratings');
    return await res.json();
  }

  async getPendingMovies(): Promise<MovieOut[]> {
    const res = await fetch(`${this.apiUrl}/admin/movies/pending`);
    if (!res.ok) throw new Error('Failed to fetch pending movies');
    return await res.json();
  }

  async approveMovie(movieId: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/admin/movies/${movieId}/approve`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to approve movie');
    return await res.json();
  }

  async rejectMovie(movieId: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/admin/movies/${movieId}/reject`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reject movie');
    return await res.json();
  }

  // ===== USERS =====
  async getUserProfile(userId: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  }

  async updateUserProfile(userId: string, profile: any): Promise<any> {
    const res = await fetch(`${this.apiUrl}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  }
}