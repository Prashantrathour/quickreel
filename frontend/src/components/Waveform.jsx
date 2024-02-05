import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './Waveform.css';

const Waveform = ({ originalAudioFile, processedAudioFile }) => {
  const waveformRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'black',
        progressColor: 'red',
        responsive: true,
      });
      setWaveSurfer(wavesurfer);
      return () => {
        wavesurfer.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (waveSurfer && originalAudioFile) {
      waveSurfer.loadBlob(originalAudioFile);
    }
  }, [waveSurfer, originalAudioFile]);

  useEffect(() => {
    if (waveSurfer && processedAudioFile) {
      waveSurfer.loadBlob(processedAudioFile);
    }
  }, [waveSurfer, processedAudioFile]);

  const handlePlayPause = () => {
    if (waveSurfer) {
      if (!isPlaying) {
        waveSurfer.play();
      } else {
        waveSurfer.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <div className="waveform-container">
        <div className="waveform" ref={waveformRef}></div>
      </div>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  );
};

export default Waveform;
