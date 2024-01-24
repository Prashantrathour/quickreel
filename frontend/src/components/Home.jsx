import React, { useState } from 'react';
import axios from 'axios';

import './Home.css';
import Waveform from './Waveform';

const Home = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [sensitivity, setSensitivity] = useState(0.5); 
    const [processedAudio, setProcessedAudio] = useState(null);
  
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      setAudioFile(file);
    };
  
    const handleSensitivityChange = (event) => {
      const newSensitivity = parseFloat(event.target.value);
      setSensitivity(newSensitivity);
    };
  

  
    const handleProcessAudio = async () => {
      try {
        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('sensitivity', sensitivity);
  
      
        const response = await axios.post('http://localhost:8000/process-audio', formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },});
        
  
        console.log(response.data.processedAudio);
        setProcessedAudio(response.data.processedAudio);
      } catch (error) {
        console.error('Error processing audio:', error);
      }
    };
  
    return (
      <div>
        <h1>Filler Word Remover</h1>
        <input type="file"  accept="audio/*,video/*" onChange={handleFileUpload} />
        <Waveform originalAudioFile={audioFile} processedAudioFile={processedAudio}  />
     
        <div>
          <label>Sensitivity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sensitivity}
            onChange={handleSensitivityChange}
          />
          {sensitivity}
        </div>
        <button onClick={handleProcessAudio}>Process Audio</button>
      </div>
    );
}

export default Home
