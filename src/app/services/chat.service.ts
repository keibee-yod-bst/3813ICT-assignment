// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://s5270448.elf.ict.griffith.edu.au:8080';

@Injectable({
  providedIn: 'root'
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
    this.socket.on('chatMessage', (message: string) => {
      callback(message);
    });
  }

  // New method to share peerId
  sharePeerId(channelId: string, peerId: string) {
    this.socket.emit('sharePeerId', { channelId, peerId });
  }

  // New method to receive peerIds from others
  receivePeerId(callback: (peerId: string) => void) {
    this.socket.on('sharePeerId', (data: { peerId: string }) => {
      callback(data.peerId);
    });
  }
}
