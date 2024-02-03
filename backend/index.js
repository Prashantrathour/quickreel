
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import startAudioFixing  from './audioUtils.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(cors());

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('audio'), async (req, res) => {
  
  try {
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Processing endpoint
app.get('/process/:filename', async (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  
  try {
   
    const processedAudio = await startAudioFixing(filePath);
    
    fs.unlinkSync(filePath)
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.get('/download', async (req, res) => {
  const filePath = path.join(__dirname, 'output', 'output-file.mp3');

  try {
      if (fs.existsSync(filePath)) {
          res.download(filePath, 'output-file.mp3', (err) => {
              if (err) {
                  console.error('Error downloading file:', err);
                  res.status(500).send('Error downloading file');
              } else {
                  console.log('File downloaded successfully');
                  fs.unlinkSync(filePath); // Delete the file after download
              }
          });
      } else {
          // File not found, send a 404 response
          console.error('File not found:', filePath);
          res.status(404).send('File not found');
      }
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send(error.message);
  }
});

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
