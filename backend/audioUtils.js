
import fs from 'fs';
import { Lame } from 'node-lame';
import toWav from 'audiobuffer-to-wav';
import util from 'audio-buffer-utils';
import pkg from 'lodash';
const { min, max, mean,chunk, flattenDeep } = pkg;
import decode from 'audio-decode';

// const testFileName = './test.ogg';



// export const SILENCE_LEVEL = 0;
const SILENCE_LEVEL = 0.00003;

 const toBuffer = (ab) => {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

function load(file) {
  
   
    return new Promise(function (done, reject) {
        fs.readFile(file, function (err, fileData) {
            err ? reject(err) : done(fileData)
        })
    })
}

//This function returns an AudioBuffer that has all 'silences' below the threshold removed
//please note this is only working on the first channel
const removeSilenceFromAudioData = async (soundfile, threshold) => {
    const inputAudioBuffer = await decode(soundfile);
    const no_silences = 
    await silenceRemovalAlgorithm(inputAudioBuffer
        .getChannelData(0))
    const output = util.create(no_silences,{
        channels: inputAudioBuffer.numberOfChannels,
        length: inputAudioBuffer.length,
        sampleRate: inputAudioBuffer.sampleRate
    });
    return output;
}

 const silenceRemovalAlgorithm = async (channelData) => {
    //split this into seperate chunks of a certain amount of samples
    const step = 160;
    const threshold = 0.4;
    const output = [];
    let _silenceCounter = 0;
    //now chunk channelData into 
    chunk(channelData,step).map((frame)=>{
        //square every value in the frame
        const squaredFrame = frame.map((x)=>x**2);
        const _min  = min(squaredFrame) || 0;
        const _max  = max(squaredFrame) || 0;
        const _ptp = _max-_min;
        const _avg = mean(squaredFrame);
        const thd = (_min+_ptp)*threshold;
            if(_avg<=thd){
                _silenceCounter++;
            } else {
                _silenceCounter=0;
            }
        //if there are 20 or more consecutive 'silent' frames then ignore these frames, do not return
            if(_silenceCounter>=20) {
                //dont append to the output
            } 
            else {
                //append to the output
                output.push([...frame]);
            }
    })
    console.log("TCL: result -> result", flattenDeep(output).length)
    return flattenDeep(output);
}

//This function returns an AudioBuffer that has all 'silences' below the threshold removed
//please note this is only working on the first channel
 const removeSilenceFromAudio = async (filename, threshold) => {
    const soundfile = await load(filename);
    console.log(soundfile)
    return await removeSilenceFromAudioData(soundfile, threshold)
}

 const removePausesAndAddPadding = async (audioData, threshold) => {
    const clean_audio = await removeSilenceFromAudio(audioData, SILENCE_LEVEL);
    const rate = clean_audio.sampleRate;
    const padding = util.create(2 * rate, 1, rate);
    const all = util.concat(padding,clean_audio,padding);
    return all;
}

const startAudioFixing = async (testFileName) => {
    
    try {
        const output = await removePausesAndAddPadding(testFileName, SILENCE_LEVEL);
        
        const outputBuffer = toBuffer(toWav(output));
        const outputFilePath = './output/output-file.mp3';
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
        const encoder = new Lame({
            "output": `./output/output-file.mp3`,
            "bitrate": 320
        }).setBuffer(outputBuffer);
        return encoder.encode();
    } catch (error) {
        console.error(error)
    }
}
export  default startAudioFixing;