# Chat Application with Video, Image Upload, and MongoDB Support  
**3813ICT Software Frameworks**  
**s5270448 Kei Giliam**

This is a real-time chat application developed as part of the **3813ICT Assignment Phase 2**. It includes **MongoDB integration**, **video chat with PeerJS**, **image uploads**, and **socket-based real-time messaging**.

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
- **Register, log in**, and **update profile pictures**.
- **Join chat channels** and **send text or image messages**.
- **Initiate video calls** with online users.

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

### Clone the repository:
```bash
git clone https://github.com/keibee-yod-bst/s5270448-2024-3813ICT-Assignment
cd src/app

# Chat Application with Video, Image Upload, and MongoDB Support

## Backend Setup:
### Install dependencies:
```bash
cd server
npm install


Start MongoDB:
mongod --dbpath=/your/db/path
