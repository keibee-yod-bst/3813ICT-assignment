// register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const BACKEND_URL = 'http://localhost:3000'; // Adjust as necessary

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
  };

  constructor(private router: Router, private httpClient: HttpClient) {}

  onSubmit() {
    this.httpClient.post(BACKEND_URL + '/register', this.user).subscribe(
      (data: any) => {
        if (data.ok) {
          alert('Registration successful!');
          this.router.navigateByUrl('/login');
        } else {
          alert('Registration failed: ' + data.error);
        }
      },
      (error) => {
        console.error('Registration error:', error);
        alert('An error occurred during registration.');
      }
    );
  }
}
