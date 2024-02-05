// App.js
import React, { useState } from 'react';
import axios from 'axios';
import Waveform from './Waveform';
import "../App.css"
const AudioFilter = () => {
  const BASEURL = "http://localhost:5000";
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showProcess_btn, setShowProcess_btn] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setShowDownload(false);
  };

  const handleUpload = async () => {
    setShowProcess_btn(false)
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      await axios.post(BASEURL + '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("File uploaded successfully");
      setShowProcess_btn(true)
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      alert("Please select a file to process");
      return;
    }
    try {
      setProcessing(true);
      const filename = selectedFile.name;
      await axios.get(`${BASEURL}/process/${filename}`);
      setProcessing(false);
      setShowDownload(true);
      alert("Audio processed successfully");
    } catch (error) {
      console.error(error);
      alert('Failed to process audio');
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(BASEURL + '/download', {
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
    <div className="container">
      <h1 className="heading">Audio Processor</h1>
      {selectedFile&&<Waveform originalAudioFile={selectedFile} />}
      <input type="file" accept="audio/*" onChange={handleFileChange} className="file-input" />
      <button onClick={handleUpload} disabled={!selectedFile || processing} className="btn upload-btn">
        Upload
      </button>
      {showDownload && (
        <button onClick={handleDownload} className="btn download-btn">
          Download
        </button>
      )}
      {showProcess_btn&&<button onClick={handleProcess} disabled={!selectedFile || processing} className="btn process-btn">
        Process
      </button>}
      {processing && <p className="processing-msg">Processing...</p>}
    </div>
  );
};

export default AudioFilter;
