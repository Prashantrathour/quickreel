// App.js
import React, { useState } from 'react';
import axios from 'axios';

const AudioFilter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  };

  const handleProcess = async () => {
    try {
      setProcessing(true);
      const filename = selectedFile.name;
      await axios.get(`http://localhost:5000/process/${filename}`).then(response => {
        console.log(response)
        setProcessing(false);
      });
    } catch (error) {
      console.error(error);
      alert('Failed to process audio');
      setProcessing(false);
    }
  };
  const handleDownload = async () => {
    try {
        const response = await axios.get('http://localhost:5000/download', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output-file.mp3');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to download audio:', error);
        alert('Failed to download audio');
    }
};

  return (
    <div>
      <h1>Audio Processor</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDownload}>download</button>
      <button onClick={handleProcess} disabled={!selectedFile || processing}>Process</button>
      {processing && <p>Processing...</p>}
    </div>
  );
};

export default AudioFilter;
