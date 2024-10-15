import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userid = 0;
  username = '';
  userrole = '';
  usergroup: string = '';

  constructor(private authService: AuthService, private httpClient: HttpClient) {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
      this.userrole = user.roles.join(', ');
      this.usergroup = user.groups ? user.groups.join(', ') : '';
      this.userid = user._id;
    }
  }

  editFunc() {
    let userobj = {
      'userid': this.userid,
      'username': this.username,
      'userrole': this.userrole,
      'usergroup': this.usergroup
    };

    this.httpClient.post<any>(BACKEND_URL + '/loginafter', userobj, httpOptions)
      .subscribe((m: any) => { alert(JSON.stringify(m)); });
  }
}
