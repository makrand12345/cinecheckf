import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- added

@Component({
  selector: 'app-movie-details',
  standalone: true,                // <-- added
  imports: [CommonModule],         // <-- added to enable *ngIf / Common directives
  templateUrl: './movie-details.html'
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;
  isLoading = true;
  error: string | null = null;

  // expose Math to template
  Math = Math;

  // UI state
  userLiked = false;
  userSaved = false;
  avgRating: number | null = null;
  userRating: number | null = null;

  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.loadMovie();
  }

  async loadMovie() {
    this.isLoading = true;
    this.error = null;
    this.movie = null;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.error = 'Invalid movie id'; this.isLoading = false; this.cd.detectChanges(); return; }

    try {
      const url = `https://cinecheckb.onrender.com/api/v1/movies/${id}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const data = await resp.json();

      // optional: fetch rating/like/save state for current user (if endpoints exist)
      // const state = await fetch(`https://cinecheckb.onrender.com/api/v1/movies/${id}/state`, { credentials: 'include' }).then(r=>r.json());

      this.ngZone.run(() => {
        this.movie = data;
        // populate UI state from movie if available
        this.avgRating = data.avg_rating ?? null;
        // userRating / userLiked / userSaved may be fetched from user endpoints; default false
        this.userRating = null;
        this.userLiked = false;
        this.userSaved = false;
        this.isLoading = false;
        this.cd.detectChanges();
      });
    } catch (err) {
      console.error('MovieDetails load error:', err);
      this.ngZone.run(() => {
        this.error = 'Failed to load movie';
        this.isLoading = false;
        this.cd.detectChanges();
      });
    }
  }

  // optimistic toggle like
  async toggleLike() {
    if (!this.movie) return;
    const id = this.movie.id;
    const method = this.userLiked ? 'DELETE' : 'POST';
    try {
      // adjust URL to match your backend (example /movies/{id}/like)
      const resp = await fetch(`https://cinecheckb.onrender.com/api/v1/movies/${id}/like`, { method, credentials: 'include' });
      if (!resp.ok) throw new Error('like failed');
      this.ngZone.run(() => {
        this.userLiked = !this.userLiked;
        this.cd.detectChanges();
      });
    } catch (err) {
      console.error('Like error', err);
    }
  }

  // optimistic toggle save/watchlist
  async toggleSave() {
    if (!this.movie) return;
    const id = this.movie.id;
    try {
      const resp = await fetch(`https://cinecheckb.onrender.com/api/v1/users/me/watchlist`, {
        method: this.userSaved ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_id: id }),
        credentials: 'include'
      });
      if (!resp.ok) throw new Error('watchlist failed');
      this.ngZone.run(() => {
        this.userSaved = !this.userSaved;
        this.cd.detectChanges();
      });
    } catch (err) {
      console.error('Save error', err);
    }
  }

  // submit rating (1-5)
  async submitRating(rating: number) {
    if (!this.movie) return;
    const id = this.movie.id;
    try {
      const resp = await fetch(`https://cinecheckb.onrender.com/api/v1/movies/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
        credentials: 'include'
      });
      if (!resp.ok) throw new Error('rating failed');
      const updated = await resp.json(); // expect updated avg or movie object
      this.ngZone.run(() => {
        this.userRating = rating;
        this.avgRating = updated.avg_rating ?? this.avgRating;
        this.cd.detectChanges();
      });
    } catch (err) {
      console.error('Rating error', err);
    }
  }
}

// export alias so existing app.routes.ts import { MovieDetails } works
export { MovieDetailsComponent as MovieDetails };
