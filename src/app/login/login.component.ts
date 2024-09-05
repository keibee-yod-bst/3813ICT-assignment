import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name = "";
  username =  "";
  password = "";

  users = [
    { name: "Yoda", username: "yoda@griffith.au", password: "yoda413" },
    { name: "Buster", username: "buster@griffith.au", password: "buster816" },
    { name: "Porthus", username: "porthus@griffith.au", password: "porthus1234" }
  ];

  constructor(private router: Router) {}

  itemClicked() {
    console.log(this.name, this.username, this.password);
  
    // Corrected logic for finding a user with matching username and password
    let find = this.users.some(user =>
      user.username === this.username && user.password === this.password
    );
    

    if (find) {
      // Corrected template literal syntax for the alert
      alert(`Welcome ${this.name} ${this.username}`);
      // Navigate to the account page if a user is found
      this.router.navigateByUrl("/account");
    } else {
      // Show an error if no match is found
      alert("Invalid username or password. Please try again.");
    }
  }
}
