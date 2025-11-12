import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieCard } from '../movie-card/movie-card';
import { Api } from '../../services/api';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCard],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  private api = inject(Api);
  private cd = inject(ChangeDetectorRef);
  
  user: any = null;
  editUser: any = null;
  submittedMovies: any[] = [];
  ratedMovies: any[] = [];
  loading = false;
  error = '';
  editMode = false;
  updating = false;
  isOwnProfile = false;

  async ngOnInit() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      await this.loadUserProfile(currentUserId);
      this.isOwnProfile = true;
    } else {
      this.error = 'User not logged in.';
      this.cd.detectChanges();
    }
  }

  async loadUserProfile(userId: string) {
    this.loading = true;
    this.error = '';
    this.cd.detectChanges();
    
    try {
      this.user = await this.api.getUserProfile(userId);
      this.editUser = { ...this.user };
      await this.loadUserMovies(userId);
    } catch (err: any) {
      this.error = 'Failed to load user profile. Please try again.';
    } finally {
      this.loading = false;
      // Use setTimeout to avoid change detection issues
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    }
  }

  async loadUserMovies(userId: string) {
    try {
      const allMovies = await this.api.getMovies();
      this.submittedMovies = allMovies.filter(movie => movie.submitted_by === userId);
      this.ratedMovies = [];
      // Use setTimeout to avoid change detection issues
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    } catch (err) {
      console.error('Error loading user movies:', err);
    }
  }

  async updateProfile() {
    this.updating = true;
    this.cd.detectChanges();
    
    try {
      await this.api.updateUserProfile(this.user.email, this.editUser);
      this.user = { ...this.editUser };
      this.editMode = false;
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.updating = false;
      setTimeout(() => {
        this.cd.detectChanges();
      }, 0);
    }
  }

  cancelEdit() {
    this.editUser = { ...this.user };
    this.editMode = false;
    setTimeout(() => {
      this.cd.detectChanges();
    }, 0);
  }
}