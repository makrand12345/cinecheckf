import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  isLoggedIn = input<boolean>(false);
  moviesCount = input<number>(0);
  navigateTo = output<'movies' | 'auth'>();

  navigateToMovies() {
    this.navigateTo.emit('movies');
  }

  navigateToAuth() {
    this.navigateTo.emit('auth');
  }
}