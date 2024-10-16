// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000'; // Adjust for local testing

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Added HttpClientModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private authService: AuthService, private router: Router, private httpClient: HttpClient) {}

  submit() {
    const user = { username: this.username, password: this.password };

    this.httpClient.post(BACKEND_URL + '/login', user)
      .subscribe(
        (data: any) => {
          if (data.ok) {
            this.authService.setToken(data.token);
            this.authService.setUser(data.user);

            // Redirect to profile page after successful login
            this.router.navigateByUrl('/profile');
          } else {
            alert(data.error || 'An unknown error occurred');
          }
        },
        (error) => {
          console.error('Login error response:', error);
          alert('Login failed: ' + (error.error?.message || 'No error message returned from server'));
        }
      );
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
