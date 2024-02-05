# Audio Processing Application

This project is an audio processing application built with React JavaScript for the frontend and Node.js with Express for the backend. The application allows users to upload audio files and process them to remove filler words like "umm", "aa", and silence.

## Purpose of Packages

- **audio-buffer-utils**: Provides utilities for working with audio buffers.
- **audio-decode**: Decodes audio files to allow processing.
- **audiobuffer-to-wav**: Converts audio buffers to WAV format.
- **cors**: Enables Cross-Origin Resource Sharing for the Express server.
- **dotenv**: Allows loading environment variables from a .env file into process.env.
- **express**: Web application framework for Node.js, used to build the backend server.
- **fluent-ffmpeg**: A JavaScript wrapper around FFmpeg, used for audio processing.
- **lodash**: Utility library that provides functions for common programming tasks.
- **mime-types**: Provides a mapping between file extensions and MIME types.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **node-lame**: Node.js bindings for LAME (LAME Ain't an MP3 Encoder), used for MP3 encoding.
- **node-wav**: Reads and writes WAV audio files.
- **nodemon**: Monitors changes in the Node.js application and automatically restarts the server.
- **opus.js**: JavaScript implementation of the Opus audio codec.

## Prerequisites

Before running the application locally, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- LAME should config in system

## Installation

1. Clone the repository to your local machine:
   ```
     cd backend
     npm i
      npm runserver
      cd frontend
      npm i
      npm run dev

The frontend server will start at `http://localhost:3000` and open in your default web browser.

## Technologies Used

- React JavaScript
- Node.js
- Express
- Multer
- Fluent-ffmpeg
- lodash
- Other dependencies listed in the `package.json` file

