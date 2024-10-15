// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
// Import your AuthService
import { AuthService } from '../services/auth.service'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Optionally, store the attempted URL for redirecting
      // this.authService.redirectUrl = state.url;

      // Navigate to the login page with extras
      this.router.navigate(['/login']);
      return false;
    }
  }
}
