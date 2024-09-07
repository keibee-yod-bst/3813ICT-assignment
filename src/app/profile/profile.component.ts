import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userid = 0;
  username = "";
  userbirthdate = "";
  userage = 0;
  editFunc(){}
}
