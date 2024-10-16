// src/app/chat/chat.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Peer } from 'peerjs';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  channelId = ''; // Current channel ID
  username = 'User' + Math.floor(Math.random() * 1000); // Random username
  messageInput = ''; // Message input from user
  messages: { username: string; message: string }[] = []; // Store chat messages
  systemMessages: string[] = []; // Store system messages (join/leave notifications)

  peer!: Peer;
  peerId!: string;
  otherPeerId?: string; // ID of the other user in the video call

  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Retrieve the channel ID from the route parameters
    this.channelId = this.route.snapshot.params['id'];

    // Join the chat channel
    this.chatService.joinChannel(this.channelId, this.username);

    // Retrieve and display chat history when joining
    this.chatService.onChatHistoryReceived((chatHistory) => {
      chatHistory.forEach((msg: any) => {
        this.messages.push({ username: msg.username, message: msg.message });
      });
      this.scrollToBottom();
    });

    // Listen for incoming chat messages
    this.chatService.onMessageReceived((data) => {
      this.messages.push(data);
      this.scrollToBottom();
    });

    // Listen for users joining the channel
    this.chatService.onUserJoined((message: string) => {
      this.systemMessages.push(message);
      this.scrollToBottom();
    });

    // Listen for users leaving the channel
    this.chatService.onUserLeft((message: string) => {
      this.systemMessages.push(message);
      this.scrollToBottom();
    });

    // Initialize PeerJS for video chat
    this.initializePeer();

    // Listen for incoming PeerJS IDs
    this.chatService.receivePeerId((peerId: string) => {
      this.otherPeerId = peerId;
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.channelId, this.username, this.messageInput);
      this.messageInput = ''; // Clear the input field after sending
    }
  }

  initializePeer() {
    this.peer = new Peer({
      host: 'localhost',
      port: 9000, // Port for PeerJS server
      path: '/peerjs',
      debug: 3,
    });

    // When the peer connection is open, share the peer ID
    this.peer.on('open', (id: string) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);
      this.chatService.sharePeerId(this.channelId, this.peerId);
    });

    // Listen for incoming calls and answer with video stream
    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with your stream
          call.on('stream', (remoteStream) => {
            this.addVideoStream(remoteStream);
          });
        })
        .catch((err) => console.error('Failed to get local stream', err));
    });
  }

  callPeer() {
    if (!this.otherPeerId) {
      console.error('No peer ID to call');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const call = this.peer.call(this.otherPeerId as string, stream);
        call.on('stream', (remoteStream) => {
          this.addVideoStream(remoteStream);
        });
      })
      .catch((err) => console.error('Failed to get local stream', err));
  }

  addVideoStream(stream: MediaStream) {
    const video = this.myVideo.nativeElement;
    video.srcObject = stream;
    video.play();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }, 100);
  }

  ngOnDestroy() {
    // Leave the channel on component destruction
    this.chatService.leaveChannel(this.channelId, this.username);
  }
}
