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
  messageInput = ''; // Chat message input
  messages: { username: string; message: string; isImage: boolean }[] = []; // Store chat messages
  systemMessages: string[] = []; // System messages (join/leave notifications)
  onlineUsers: { username: string; peerId?: string; profileImage?: string }[] = []; // Track online users
  profileImage: string = ''; // Track user's profile image

  peer!: Peer;
  peerId!: string;
  otherPeerId?: string; // Store peer ID of the selected user for video call

  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.channelId = this.route.snapshot.params['id']; // Get channel ID from route

    // Join the chat channel
    this.chatService.joinChannel(this.channelId, this.username);

    // Retrieve and display chat history
    this.chatService.onChatHistoryReceived((chatHistory) => {
      chatHistory.forEach((msg) => {
        this.messages.push({
          username: msg.username,
          message: msg.message,
          isImage: msg.isImage || false,
        });
      });
      this.scrollToBottom();
    });

    // Listen for incoming chat messages
    this.chatService.onMessageReceived((data: { username: string; message: string; isImage?: boolean }) => {
      const messageContent = data.isImage 
        ? `http://localhost:3000${data.message}` // Prefix with backend URL for images
        : data.message;
    
      this.messages.push({
        username: data.username,
        message: messageContent,
        isImage: data.isImage ?? false,
      });
    
      this.scrollToBottom();
    });    

    // Listen for users joining the channel
    this.chatService.onUserJoined((user: { username: string; peerId?: string; profileImage?: string }) => {
      this.onlineUsers.push(user);
      this.systemMessages.push(`${user.username} joined the channel`);
      this.scrollToBottom();
    });

    // Listen for users leaving the channel
    this.chatService.onUserLeft((username) => {
      this.onlineUsers = this.onlineUsers.filter((user) => user.username !== username);
      this.systemMessages.push(`${username} left the channel`);
      this.scrollToBottom();
    });

    // Initialize PeerJS for video chat
    this.initializePeer();

    // Listen for incoming peer IDs
    this.chatService.receivePeerId((peerId: string) => {
      this.otherPeerId = peerId;
    });
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      this.chatService.sendMessage(this.channelId, this.username, this.messageInput);
      this.messageInput = ''; // Clear input field
    }
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('chatImage', file);
    formData.append('channelId', this.channelId);
    formData.append('username', this.username);

    this.chatService.uploadChatImage(formData).subscribe(
      () => {
        console.log('Image sent successfully');
      },
      (error) => {
        console.error('Failed to send image:', error);
      }
    );
  }

  selectProfileImage(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    this.chatService.uploadProfileImage(formData).subscribe(
      (response: any) => {
        this.profileImage = response.imagePath;
        console.log('Profile image updated:', response.imagePath);
      },
      (error) => {
        console.error('Failed to upload profile image:', error);
      }
    );
  }

  initializePeer() {
    this.peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/peerjs',
      debug: 3,
    });

    this.peer.on('open', (id: string) => {
      this.peerId = id;
      console.log('My peer ID is: ' + id);
      this.chatService.sharePeerId(this.channelId, this.peerId);
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          call.on('stream', (remoteStream) => {
            this.addVideoStream(remoteStream);
          });
        })
        .catch((err) => console.error('Failed to get local stream', err));
    });
  }

  callUser(user: { username: string; peerId?: string }) {
    if (!user.peerId) {
      console.error('This user is not available for a call.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.myVideo.nativeElement.srcObject = stream;
        this.myVideo.nativeElement.play();
        const call = this.peer.call(user.peerId as string, stream);
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
    this.chatService.leaveChannel(this.channelId, this.username);
  }
}
