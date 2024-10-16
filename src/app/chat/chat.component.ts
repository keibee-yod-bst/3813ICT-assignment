import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Peer } from 'peerjs';
import { ChatService } from '../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageInput = '';
  channelId = '';

  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;

  peer!: Peer;
  peerId!: string;
  currentPeer: any;
  otherPeerId?: string;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get channelId from route parameters
    this.channelId = this.route.snapshot.params['id'];

    // Initialize text chat functionalities
    this.chatService.joinChannel(this.channelId);
    this.chatService.receiveMessage((message: string) => {
      this.messages.push(message);
    });

    // Initialize video chat functionalities
    this.initializePeer();

    // Listen for peerIds from others
    this.chatService.receivePeerId((peerId: string) => {
      this.otherPeerId = peerId;
      // Optionally, automatically call the other peer
      // this.callPeer(this.otherPeerId);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.channelId, this.messageInput);
    this.messageInput = '';
  }

  // src/app/chat/chat.component.ts

// ... [rest of your code above]

initializePeer() {
  this.peer = new Peer({
    host: 'localhost',
    port: 9000, // Port where your PeerJS server is running
    path: '/peerjs', // This should match the mount point on the server
    debug: 3,
  });

    // Option 2: Pass null as the first argument
    /*
    this.peer = new Peer(null, {
      host: 'localhost',
      port: 9000,
      path: '/',
      debug: 3,
    });
    */

    this.peer.on('open', (id: string) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);
      // Share your peerId with others in the channel
      this.chatService.sharePeerId(this.channelId, this.peerId);
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with your own video/audio stream
          call.on('stream', (remoteStream) => {
            this.addVideoStream(remoteStream);
          });
        })
        .catch((err) => {
          console.error('Failed to get local stream', err);
        });
    });
  }

  callPeer(peerId: string | undefined) {
    if (!peerId) {
      console.error('No peerId to call');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = this.peer.call(peerId, stream);
        call.on('stream', (remoteStream) => {
          this.addVideoStream(remoteStream);
        });
      })
      .catch((err) => {
        console.error('Failed to get local stream', err);
      });
  }

  addVideoStream(stream: MediaStream) {
    const video = this.myVideo.nativeElement;
    video.srcObject = stream;
    video.play();
  }
}
