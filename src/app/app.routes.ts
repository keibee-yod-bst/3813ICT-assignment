// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { ChannelComponent } from './channel/channel.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard], // Protect this route
  },
  {
    path: 'channels',
    component: ChannelComponent,
    canActivate: [AuthGuard], // Protect this route if needed
  },
  {
    path: 'channels/:id',
    component: ChatComponent,
    canActivate: [AuthGuard], // Protect this route if needed
  },
  // Wildcard route for a 404 page
  { path: '**', redirectTo: '/login' }
];
