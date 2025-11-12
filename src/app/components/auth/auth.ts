import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class Auth {
  private api = inject(Api);

  @Output() loginSuccess = new EventEmitter<any>();

  isLoginMode = true;
  loading = false;
  error = '';
  success = '';
  confirmPassword = '';
  credentials = { username: '', email: '', password: '', role: 'user' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.credentials = { username: '', email: '', password: '', role: 'user' };
    this.confirmPassword = '';
  }

async onSubmit() {
  if (!this.isLoginMode && this.credentials.password !== this.confirmPassword) {
    this.error = 'Passwords do not match';
    return;
  }

  this.loading = true;
  this.error = '';
  this.success = '';

  try {
    if (this.isLoginMode) {
      const result = await this.api.login({
        email: this.credentials.email,
        password: this.credentials.password
      });

     
      
      localStorage.setItem('currentUserId', result.user.email);
      sessionStorage.setItem('cinecheck_user', JSON.stringify(result.user));
      
      this.loginSuccess.emit(result.user);
      this.success = 'Login successful!';
      
    } else {
      // SIGNUP
      const result = await this.api.signup(this.credentials);
      
      
      localStorage.setItem('currentUserId', result.user.email);
      sessionStorage.setItem('cinecheck_user', JSON.stringify(result.user));
      
      this.loginSuccess.emit(result.user);
      this.success = 'Account created successfully!';
      
      // CLEAR FORM AFTER SUCCESSFUL SIGNUP
      this.credentials = { username: '', email: '', password: '', role: 'user' };
      this.confirmPassword = '';
    }
  } catch (err: any) {
    this.error = err.message || 'An error occurred';
  } finally {
    this.loading = false;
  }
}
}