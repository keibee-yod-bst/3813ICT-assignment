// src/app/chat/chat.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Peer } from 'peerjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  
})
export class ChatComponent implements OnInit {
  messages: string[] = [];
  messageInput = '';
  channelId = ''; // Set this to the current channel's ID

  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;

  peer!: Peer;
  peerId!: string;
  currentPeer: any;
  otherPeerId?: string; // May be undefined initially

  constructor(private chatService: ChatService) {}

  ngOnInit() {
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

  initializePeer() {
    this.peer = new Peer({
      host: 'localhost',
      port: 3000, // Or the port where your PeerJS server is running
      path: '/peerjs'
    });    
  
    this.peer.on('open', (id: string) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);
      // Share your peerId with others in the channel
      this.chatService.sharePeerId(this.channelId, this.peerId);
    });
  
    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
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

    const confirmedPeerId = peerId; // TypeScript now knows this is a string

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = this.peer.call(confirmedPeerId, stream);
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
