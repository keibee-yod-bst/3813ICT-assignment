# Chat System (Text/Video) with MEAN Stack

This project is a real-time text/video chat system built using the MEAN stack (MongoDB, Express, Angular, Node.js) along with Socket.IO and Peer.js for real-time communication and video chat.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Features
- Real-time communication within groups and channels.
- User authentication with different roles: Super Admin, Group Admin, User.
- Super Admin can manage users and promote/demote Group Admins.
- Group Admin can create/manage groups and channels.
- Video chat support using Peer.js.

## Project Structure

### Client-Side (Angular)
- **Components**:
  - `LoginComponent`: User authentication.
  - `ProfileComponent`: User profile details.
  - `AccountComponent`: User account overview.
  - `ChannelComponent`: User switch one or multiple channels.
  - `ChatComponent`: Real-time chat with support for text, images, and video.
- **Services**:
  - `ChatService`: Manages chat operations via Socket.IO.
- **Models**:
  - `User`: Defines the user entity (username, email, roles, groups).
  - `Group`: Defines the group entity (name, channels, users).
  - `Channel`: Defines the channel entity within a group.
  
### Server-Side (Node.js + Express)
- **Modules**:
  - `users.js`: API routes for user management.
  - `groups.js`: API routes for groups and channels.
  - `chat.js`: Real-time chat functionality using Socket.IO.
- **Database**:
  - MongoDB is used to store users, groups, channels, and chat history.

### Sockets and Peer.js
- **Socket.IO**: Enables real-time text chat across channels.
- **Peer.js**: Provides video chat functionality.

## Server Routes
------------ | -------------
- **POST /login**: |User login.
- **POST /register**: |User registration (Super Admin).
- **POST /group**: |Create a new group (Group Admin).
- **POST /channel**: |Create a new channel within a group.
- **GET /chat/:channelId**: |Get chat history for a channel.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/keibee-yod-bst/s5270448-2024-3813ICT-Assignment
   cd assignment
