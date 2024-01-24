const express = require('express');
const multer = require('multer');
const fluentffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/process-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }

    const audioBuffer = req.file.buffer;

    // Process audio logic using fluent-ffmpeg
    const processedBuffer = await processAudio(audioBuffer);

    // Save the processed audio to a file
    const outputPath = path.join(__dirname, 'uploads', 'processed-audio.wav');
    await fs.writeFile(outputPath, processedBuffer);

    res.json({ success: true, message: 'Processing complete' });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

app.get('/processed-audio.wav', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'processed-audio.wav');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function processAudio(audioBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const ffmpegCommand = fluentffmpeg()
        .input(audioBuffer)
        .audioCodec('pcm_s16le')
        .toFormat('wav');

      ffmpegCommand.on('end', (stdout, stderr) => {
        console.log('Audio processing complete');
        const processedBuffer = fs.readFileSync('temp.wav');
        resolve(processedBuffer);
      }).on('error', (err) => {
        console.error('Error converting audio:', err);
        reject(err);
      });

      ffmpegCommand.save('temp.wav');
    } catch (error) {
      console.error('Error during audio processing setup:', error);
      reject(error);
    }
  });
}
