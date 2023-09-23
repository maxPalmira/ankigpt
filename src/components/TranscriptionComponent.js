import React, { useState } from 'react';
import axios from 'axios';

const apiKey = "AIzaSyCNCfo8JnPZZsAGkXTQC8Cw08xEs6NTEyE";
const apiUrl = "https://speech.googleapis.com/v1/speech:recognize";

const TranscriptionComponent = ({ audioBlob }) => {
  const [transcription, setTranscription] = useState('');

  console.log('TranscriptionComponent.js', audioBlob)

 const handleTranscribe = async () => {
    try {
      // Convert the audio blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const recordedAudio = reader.result.split(',')[1]; // Get the base64 data

        console.log('recordedAudio', recordedAudio)

        const requestData = {
          config: {
            // encoding: 'LINEAR16',
            // sampleRateHertz: 48000, 
            languageCode: 'en-US',
          },
          audio: {
            content: recordedAudio,
          },
        };

        const response = await axios.post(apiUrl + `?key=${apiKey}`, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const transcriptionResult = response.data.results[0].alternatives[0].transcript;
        setTranscription(transcriptionResult);
      };

      reader.onerror = (error) => {
        console.error('Error reading audio blob:', error);
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  return (
    <div>
      <button onClick={handleTranscribe}>Transcribe</button>
      <p>Transcription: {transcription}</p>
    </div>
  );
};

export default TranscriptionComponent;
