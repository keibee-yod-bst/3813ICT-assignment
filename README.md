# Chat System (Text/Video) with MEAN Stack

This project is a real-time text/video chat system built using the MEAN stack (MongoDB, Express, Angular, Node.js) along with Socket.IO and Peer.js for real-time communication and video chat.

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
  - `ChatComponent`: Real-time chat with support for text, images, and video.
- **Services**:
  - `AuthService`: Handles user authentication.
  - `ChatService`: Manages chat operations via Socket.IO.
- **Models**:
  - `User`: Defines the user entity (username, email, roles, groups).
  - `Group`: Defines the group entity (name, channels, users).
  - `Channel`: Defines the channel entity within a group.
  
### Server-Side (Node.js + Express)
- **Modules**:
  - `auth.js`: Authentication middleware.
  - `users.js`: API routes for user management.
  - `groups.js`: API routes for groups and channels.
  - `chat.js`: Real-time chat functionality using Socket.IO.
- **Database**:
  - MongoDB is used to store users, groups, channels, and chat history.

### Sockets and Peer.js
- **Socket.IO**: Enables real-time text chat across channels.
- **Peer.js**: Provides video chat functionality.

## Server Routes
- **POST /login**: User login.
- **POST /register**: User registration (Super Admin).
- **POST /group**: Create a new group (Group Admin).
- **POST /channel**: Create a new channel within a group.
- **GET /messages/:channelId**: Get chat history for a channel.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/chat-system.git
   cd chat-system

# Assignment

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
