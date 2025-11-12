import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Auth } from './components/auth/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Auth],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private router = inject(Router);
  currentView: 'home' | 'movies' | 'auth' | 'submit-movie' | 'profile' | 'admin' | 'search' = 'home';
  isLoggedIn = false;
  currentUser: any = null;

  constructor() {
    const savedUser = sessionStorage.getItem('cinecheck_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
      localStorage.setItem('currentUserId', this.currentUser.email);
    }
  }

  navigateTo(view: 'home' | 'movies' | 'auth' | 'submit-movie' | 'profile' | 'admin' | 'search') {
    this.currentView = view;
    switch(view) {
      case 'home': 
        this.router.navigate(['/']);
        break;
      case 'search': 
        this.router.navigate(['/search']);
        break;
      case 'submit-movie': 
        this.router.navigate(['/submit-movie']);
        break;
      case 'profile':
        if (this.currentUser) this.router.navigate(['/profile', this.currentUser.email]);
        else this.navigateTo('auth');
        break;
      case 'auth': 
        // Stay on current page but show auth component
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  handleLoginSuccess(user: any) {
    
    this.currentUser = user;
    this.isLoggedIn = true;
    sessionStorage.setItem('cinecheck_user', JSON.stringify(user));
    localStorage.setItem('currentUserId', user.email);
    
    // Navigate away from auth page
    this.currentView = 'home';
    this.router.navigate(['/']);
  }

  handleLogout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    sessionStorage.removeItem('cinecheck_user');
    localStorage.removeItem('currentUserId');
    this.currentView = 'home';
    this.router.navigate(['/']);
  }
}