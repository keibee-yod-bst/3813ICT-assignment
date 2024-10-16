// src/app/channel/channel.component.ts
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import if needed
import { FormsModule } from '@angular/forms';   // Import if using forms
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent {
  channels: any[] = [];

  constructor(private router: Router) {
    // Load channels from a service or API
    this.channels = [
      { id: '1', name: 'General' },
      { id: '2', name: 'Random' },
      { id: '3', name: 'Hello' },
      // Add more channels as needed
    ];
  }

  // Optionally, navigate programmatically
  goToChannel(channelId: string) {
    this.router.navigate(['/channels', channelId]);
  }
}
