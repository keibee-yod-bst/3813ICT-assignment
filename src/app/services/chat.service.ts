// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3000'; // Adjust as needed for your setup

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_ENDPOINT); // Connect to the Socket.IO server
  }

  // Join a specific channel with username
  joinChannel(channelId: string, username: string) {
    this.socket.emit('joinChannel', { channelId, username });
  }

  // Leave the channel
  leaveChannel(channelId: string, username: string) {
    this.socket.emit('leaveChannel', { channelId, username });
  }

  // Send a chat message to the channel
  sendMessage(channelId: string, username: string, message: string) {
    this.socket.emit('chatMessage', { channelId, username, message });
  }

  // Receive real-time chat messages
  onMessageReceived(
    callback: (data: { username: string; message: string; timestamp: string }) => void
  ) {
    this.socket.on('chatMessage', callback);
  }

  // Handle chat history retrieval
  onChatHistoryReceived(callback: (messages: any[]) => void) {
    this.socket.on('chatHistory', (messages: any[]) => {
      callback(messages);
    });
  }

  // Handle when a user joins a channel
  onUserJoined(callback: (user: { username: string; peerId?: string }) => void) {
    this.socket.on('userJoined', (user: { username: string; peerId?: string }) => {
      callback(user);
    });
  }  

  // Handle when a user leaves a channel
  onUserLeft(callback: (message: string) => void) {
    this.socket.on('userLeft', (message: string) => {
      callback(message);
    });
  }

  // Share PeerJS ID within the channel
  sharePeerId(channelId: string, peerId: string) {
    this.socket.emit('sharePeerId', { channelId, peerId });
  }

  // Receive a PeerJS ID from other users
  receivePeerId(callback: (peerId: string) => void) {
    this.socket.on('sharePeerId', (data: { peerId: string }) => {
      callback(data.peerId);
    });
  }
}
