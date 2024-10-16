# Chat Application with Video, Image Upload, and MongoDB Support
3813ICT Software Frameworks	s5270448 Kei Giliam

This is a real-time chat application developed as part of the 3813ICT Assignment Phase 2. It includes MongoDB integration, video chat with PeerJS, image uploads, and socket-based real-time messaging.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Project Structure](#project-structure)
- [Features](#features)
  - [MongoDB Integration](#mongodb-integration)
  - [Sockets for Real-time Messaging](#sockets-for-real-time-messaging)
  - [Image Upload](#image-upload)
  - [Video Chat with PeerJS](#video-chat-with-peerjs)
- [API Routes](#api-routes)
- [Testing](#testing)
- [Git Usage](#git-usage)
- [Conclusion](#conclusion)

---

## Introduction

This project demonstrates a chat system with advanced features such as real-time messaging using **WebSockets**, **video chat** using **PeerJS**, **image uploads**, and **MongoDB** integration for persistent data storage. 

This chat application allows users to:
- Register, log in, and update profile pictures.
- Join chat channels and send text or image messages.
- Initiate video calls with online users.

---

## Technologies Used

- **Angular** (Frontend)
- **Node.js** with **Express** (Backend)
- **MongoDB** (Database)
- **Socket.IO** (Real-time communication)
- **PeerJS** (Video chat functionality)
- **Cypress** and **Jest** (Testing)
- **GitHub** (Version control)

---

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/keibee-yod-bst/s5270448-2024-3813ICT-Assignment
   cd chat-app
Backend Setup:

Install dependencies:

cd server
npm install
Start the MongoDB server:

mongod --dbpath=/your/db/path
Start the Node server:

node server.js
Frontend Setup:

Install dependencies:

cd client
npm install
Start the Angular development server:

ng serve --open

---

## Project Structure

/chat-app
│
├── /client (Angular Frontend)
│   ├── /src
│   │   ├── app
│   │   │   ├── chat
│   │   │   ├── login
│   │   │   ├── register
│   │   │   ├── profile
│   │   │   ├── channel
│   │   │   └── services
│   │   └── assets
│   └── README.md
│
├── /server (Node.js Backend)
│   ├── /routes
│   ├── /uploads (Image uploads directory)
│   ├── /models (Mongoose models)
│   ├── server.js
│   └── README.md
│
└── README.md

---

## Features
MongoDB Integration
Users, channels, and messages are stored in a MongoDB database.
Mongoose models are used to structure data for MongoDB.
Sockets for Real-time Messaging
Socket.IO allows real-time updates when users join, leave, or send messages in channels.
Messages are broadcast instantly to all connected users.
Image Upload
Users can upload images in chat messages or set profile avatars.
Uploaded images are stored in the /uploads directory, and their paths are saved in MongoDB.
Video Chat with PeerJS
PeerJS enables video chat between users in the same channel.
PeerJS server is configured to handle WebRTC connections.

---

## API Routes
Route	Method	Description
/register	POST	Register a new user
/login	POST	User login
/upload-chat-image	POST	Upload a chat image
/profile/upload-avatar	POST	Upload or update avatar
/channels/:id	GET	Fetch chat history for a channel

---

## Testing
Unit Tests (Jest)
Backend API routes are tested using Jest.
Example test for /login:
javascript
Copy code
it('should return 200 for valid login', async () => {
  const res = await request(app).post('/login').send({ username: 'user1', password: 'pass123' });
  expect(res.statusCode).toEqual(200);
});
E2E Tests (Cypress)
Cypress tests for frontend interaction.
Example Cypress test for the login page:
javascript
Copy code
describe('Login Page', () => {
  it('should allow a user to log in', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('user1');
    cy.get('input[name="password"]').type('pass123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profile');
  });
});


## Git Usage
Initialize Git repository:


git init
Commit frequently during development:


git add .
git commit -m "Implemented basic chat feature"
Push to GitHub:


git remote add origin https://github.com/keibee-yod-bst/s5270448-2024-3813ICT-Assignment
git push -u origin main
Use branches for new features:

git checkout -b feature/video-chat

## Conclusion
This chat application integrates:
-	MongoDB for persistent data storage (users, channels, and messages).
-	Sockets for real-time chat functionality.
-	PeerJS for video chat between users.
-	Image uploads for both profile pictures and chat messages.
-	Comprehensive testing through unit, backend, and e2e tests.
-	Proper version control using Git to track development progress.
This project demonstrates the combination of real-time communication, multimedia support, and a scalable backend.
