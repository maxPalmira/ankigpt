import React, { useState } from 'react';
import { recordStart, recordStop } from '../utils.js';


const RecordComponent = ({setAudioBlob}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [buttonText, setButtonText] = useState('Start Recording');
  const [audioRecorder, setAudioRecorder] = useState(null); // Initialize audioRecorder as null


	const startRecording = async () => {
	  console.log('Recording Started');

	  setIsRecording(true);
	  setButtonText('Stop Recording');

	  try {
	    const recorder = await recordStart();
	    setAudioRecorder(recorder);
	  } catch (error) {
	    console.error('Error starting recording:', error);
	  }
	};


  const stopRecording = async () => {
    console.log('Recording Stopped');

     if (isRecording && audioRecorder) {
      const audioBlob = await recordStop(audioRecorder); // Stop recording using audioRecorder
      console.log('stopRecording()', audioBlob);
      setAudioBlob(audioBlob); // Set the audio blob in the state

      setAudioRecorder(null); // Reset audioRecorder to null
      setIsRecording(false);
      setButtonText('Start Recording');
    }

  };

  const handleButtonClick = () => {
    if (isRecording) {
      // If currently recording, stop recording
      stopRecording();
    } else {
      // If not recording, start recording
      startRecording();
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} disabled={false}>
        {buttonText}
      </button>
    </div>
  );
};


export default RecordComponent;
