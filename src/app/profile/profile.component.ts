import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = "http://s5270448.elf.ict.griffith.edu.au:8080";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userid = 0;
  username = "";
  userrole = "";
  usergroup = 0;
  constructor(private httpClient: HttpClient) {
    this.username = sessionStorage.getItem('username')!;
    this.userrole = sessionStorage.getItem('userrole')!;
    this.usergroup = Number(sessionStorage.getItem('usergroup'));
    this.userid = Number(sessionStorage.getItem('userid'));
  }

  editFunc(){
    let userobj = {
      'userid': this.userid,
      'username': this.username,
      'userrole': this.userrole,
      'usergroup': this.usergroup
    }
    this.httpClient.post<any>(BACKEND_URL + '/loginafter', userobj, httpOptions)
    .subscribe((m: any) => {alert(JSON.stringify(m));})
}
}