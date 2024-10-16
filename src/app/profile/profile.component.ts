import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  userid: string = ''; // Changed to string
  username = '';
  userrole = '';
  usergroup = '';

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    const user = this.authService.getUser();
    if (user) {
      this.userid = user._id; // Assigning string value
      this.username = user.username;
      this.userrole = user.roles.join(', ');
      this.usergroup = user.groups ? user.groups.join(', ') : '';
    }
  }

  editFunc() {
    const userobj = {
      userid: this.userid,
      username: this.username,
      userrole: this.userrole,
      usergroup: this.usergroup,
    };

    this.httpClient
      .post<any>(`${BACKEND_URL}/loginafter`, userobj, httpOptions)
      .subscribe(
        (response: any) => {
          alert(JSON.stringify(response));
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
  }
}
