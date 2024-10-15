// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit() {
    this.authService.login(this.username, this.password).subscribe(
      (data: any) => {
        if (data.ok) {
          this.authService.setToken(data.token);
          this.authService.setUser(data.user);
          this.router.navigateByUrl('/account');
        } else {
          alert(data.error);
        }
      },
      (error) => {
        alert('Login failed: ' + error.error.message);
      }
    );
  }
}
