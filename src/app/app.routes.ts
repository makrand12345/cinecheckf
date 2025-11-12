import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { Auth } from './components/auth/auth';
import { MovieDetails } from './components/movie-details/movie-details';
import { Search } from './components/search/search';
import { UserProfile } from './components/user-profile/user-profile';
import { SubmitMovie } from './components/submit-movie/submit-movie';
import { AdminPanel } from './components/admin/admin'; 

export const routes: Routes = [
  { path: '', component: MovieList },
  { path: 'auth', component: Auth },
  { path: 'movies/:id', component: MovieDetails },
  { path: 'search', component: Search },
  { path: 'profile/:id', component: UserProfile },
  { path: 'submit-movie', component: SubmitMovie },
  { path: 'admin', component: AdminPanel }, // Add admin route
  { path: '**', redirectTo: '' }
];