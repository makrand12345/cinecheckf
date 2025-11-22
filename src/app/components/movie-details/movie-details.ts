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
      const resp = await fetch(`https://cinecheckb.onrender.com/api/v1/movies/${id}`);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const data = await resp.json();

      // update inside Angular zone so change detection runs reliably
      this.ngZone.run(() => {
        this.movie = data;
        this.error = null;
        this.isLoading = false;
        this.cd.detectChanges();
      });
    } catch (err) {
      console.error('Failed loading movie', err);
      this.ngZone.run(() => {
        this.error = 'Failed to load movie';
        this.isLoading = false;
        this.cd.detectChanges();
      });
    }
  }
}
