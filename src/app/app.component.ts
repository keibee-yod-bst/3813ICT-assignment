import { Component } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, AccountComponent, ProfileComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property name and type
})
export class AppComponent {
  title = 'assignment';
}
