import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, MovieOut } from '../../services/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminPanel implements OnInit {
  private api = inject(Api);
  private cd = inject(ChangeDetectorRef);
  
  pendingMovies: MovieOut[] = [];
  loading = false;
  error = '';

  async ngOnInit() {
    await this.loadPendingMovies();
  }

  async loadPendingMovies() {
    this.loading = true;
    this.error = '';
    this.cd.detectChanges();
    
    try {
      this.pendingMovies = await this.api.getPendingMovies();
    } catch (err: any) {
      this.error = 'Failed to load pending movies: ' + err.message;
    } finally {
      this.loading = false;
      this.cd.detectChanges();
    }
  }

  async approveMovie(movieId: string) {
    try {
      await this.api.approveMovie(movieId);
      this.pendingMovies = this.pendingMovies.filter(movie => movie.id !== movieId);
      this.cd.detectChanges();
    } catch (err: any) {
      this.error = 'Failed to approve movie: ' + err.message;
      this.cd.detectChanges();
    }
  }

  async rejectMovie(movieId: string) {
    try {
      await this.api.rejectMovie(movieId);
      this.pendingMovies = this.pendingMovies.filter(movie => movie.id !== movieId);
      this.cd.detectChanges();
    } catch (err: any) {
      this.error = 'Failed to reject movie: ' + err.message;
      this.cd.detectChanges();
    }
  }
}