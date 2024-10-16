// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3000'; // Adjust as needed

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  socket: any;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT);
  }

  joinChannel(channelId: string) {
    this.socket.emit('joinChannel', { channelId });
  }

  sendMessage(channelId: string, message: string) {
    this.socket.emit('chatMessage', { channelId, message });
  }

  receiveMessage(callback: (message: string) => void) {
    this.socket.on('chatMessage', (data: any) => {
      callback(data.message);
    });
  }

  // Method to share peerId
  sharePeerId(channelId: string, peerId: string) {
    this.socket.emit('sharePeerId', { channelId, peerId });
  }

  // Method to receive peerIds from others
  receivePeerId(callback: (peerId: string) => void) {
    this.socket.on('sharePeerId', (data: { peerId: string }) => {
      callback(data.peerId);
    });
  }
}
