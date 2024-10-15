// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = "http://s5270448.elf.ict.griffith.edu.au:8080";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private router: Router, private httpClient: HttpClient) {}

  register() {
    const user = { username: this.username, email: this.email, password: this.password };
    this.httpClient.post(BACKEND_URL + '/register', user)
      .subscribe((data: any) => {
        if (data.ok) {
          alert('Registration successful!');
          this.router.navigateByUrl('/login');
        } else {
          alert(data.error);
        }
      });
  }
}
