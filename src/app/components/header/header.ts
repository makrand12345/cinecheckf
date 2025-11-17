import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  router = inject(Router);
  
  currentView = input<'home' | 'movies' | 'auth' | 'submit-movie' | 'profile' | 'admin' | 'search'>('home');
  isLoggedIn = input<boolean>(false);
  currentUser = input<any>(null);
  
  viewChange = output<'home' | 'movies' | 'auth' | 'submit-movie' | 'profile' | 'admin' | 'search'>();
  logout = output<void>();
  
  searchQuery = '';
  showMobileSearch = false;

  navigateTo(view: 'home' | 'movies' | 'auth' | 'submit-movie' | 'profile' | 'admin' | 'search') {
    this.viewChange.emit(view);
    
    if (view === 'home') this.router.navigate(['/']);
    else if (view === 'search') this.router.navigate(['/search']);
    else if (view === 'submit-movie') this.router.navigate(['/submit-movie']);
    else if (view === 'profile' && this.currentUser()) {
      // FIX: Use email instead of id
      this.router.navigate(['/profile', this.currentUser().email]);
    }
    else if (view === 'auth') this.router.navigate(['/auth']);
    else if (view === 'admin') {
      // Add admin route navigation
      this.router.navigate(['/admin']);
    }
  }

  navigateToProfile() {
    if (this.currentUser()) {
      this.router.navigate(['/profile', this.currentUser().email]);
      this.viewChange.emit('profile');
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
      this.showMobileSearch = false;
    }
  }

  toggleSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }

  handleLogout() {
    this.logout.emit();
  }
}