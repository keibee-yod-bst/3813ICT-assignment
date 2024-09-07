import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

const BACKEND_URL = "http://s5270448.elf.ict.griffithuni.edu.au:8080";

export class LoginComponent {
  email =  "";
  password = "";

  /*
  users = [
    { name: "Yoda", username: "yoda@griffith.au", password: "yoda413" },
    { name: "Buster", username: "buster@griffith.au", password: "buster816" },
    { name: "Porthus", username: "porthus@griffith.au", password: "porthus44" },
    { name: "Elle", username: "elle@griffith.au", password: "elle424" },
    { name: "Jess", username: "jess@griffith.au", password: "jess925" }
  ];
  */

  constructor(private router: Router, private httpClient: HttpClient) { };
  submit(){
    let user = {username: this.email, pwd: this.password};
    this.httpClient.post(BACKEND_URL + '/login', user, httpOptions)
    .subscribe((data:any)=>{
      alert("posting: "+JSON.stringify(user));
      alert("posting: "+JSON.stringify(data));
    })
  }

  /*
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
  */
}
