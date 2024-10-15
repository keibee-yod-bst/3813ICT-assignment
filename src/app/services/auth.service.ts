// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    const url = '/api/login'; // Adjust the URL as needed
    const body = { username, password };
    return this.httpClient.post(url, body);
  }

  // Logout method
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Get token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Set token
  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Get user
  getUser(): any {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Set user
  setUser(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.roles.includes(role);
  }
}
