import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.html'
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    console.log('[MovieDetails] ngOnInit');
    this.loadMovie();
  }

  async loadMovie() {
    console.log('[MovieDetails] loadMovie started');
    this.isLoading = true;
    this.error = null;
    this.movie = null;

    const id = this.route.snapshot.paramMap.get('id');
    console.log('[MovieDetails] Movie ID from route:', id);
    
    if (!id) {
      this.error = 'Invalid movie id';
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    try {
      const url = `https://cinecheckb.onrender.com/api/v1/movies/${id}`;
      console.log('[MovieDetails] Fetching:', url);
      
      const resp = await fetch(url);
      console.log('[MovieDetails] Response status:', resp.status);
      
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      
      const data = await resp.json();
      console.log('[MovieDetails] Data received:', data);

      // Update component properties inside Angular zone
      this.ngZone.run(() => {
        console.log('[MovieDetails] Inside ngZone.run, setting movie and isLoading=false');
        this.movie = data;
        this.error = null;
        this.isLoading = false;
        this.cd.detectChanges();
        console.log('[MovieDetails] Component state:', { movie: this.movie, isLoading: this.isLoading });
      });
    } catch (err) {
      console.error('[MovieDetails] Error:', err);
      this.ngZone.run(() => {
        this.error = `Failed to load movie: ${err}`;
        this.isLoading = false;
        this.cd.detectChanges();
      });
    }
  }
}
