import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './Waveform.css';

const Waveform = ({ originalAudioFile, processedAudioFile }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'black',
        progressColor: 'red',
        responsive: true,
      });

      if (originalAudioFile) {
        wavesurfer.load(URL.createObjectURL(originalAudioFile));
      }

      if (processedAudioFile) {
        
        wavesurfer.loadBlob(processedAudioFile);
      }

      return () => {
      
        wavesurfer.stop();
        wavesurfer.destroy();
      };
    }
  }, [originalAudioFile, processedAudioFile]);

  return (
    <div className="waveform-container">
      <div className="waveform" ref={waveformRef}></div>
    </div>
  );
};

export default Waveform;

