// server/__tests__/fileUpload.test.js
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mock route
app.post('/upload-profile', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = `/uploads/${req.file.originalname}`;
  res.json({ imagePath: filePath });
});

describe('File Upload Routes', () => {
  test('should upload profile image', async () => {
    const response = await request(app)
      .post('/upload-profile')
      .attach('profileImage', Buffer.from('file content'), 'test.png');
    expect(response.status).toBe(200);
    expect(response.body.imagePath).toContain('/uploads/');
  });

  test('should return 400 if no file uploaded', async () => {
    const response = await request(app).post('/upload-profile');
    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
});
