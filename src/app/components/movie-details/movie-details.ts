import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.html'
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMovie();
  }

  async loadMovie() {
    this.isLoading = true;
    this.error = null;
    this.movie = null;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid movie id';
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    try {
      // Use the live backend URL used by the app
      const resp = await fetch(`https://cinecheckb.onrender.com/api/v1/movies/${id}`);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      this.movie = await resp.json();
    } catch (err) {
      console.error('Failed loading movie', err);
      this.error = 'Failed to load movie';
    } finally {
      this.isLoading = false;
      // ensure the template updates
      this.cd.detectChanges();
    }
  }
}
