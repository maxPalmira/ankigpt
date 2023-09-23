import React, { useState } from 'react';
import RecordComponent from './RecordComponent'; // Import your RecordComponent
import TranscriptionComponent from './TranscriptionComponent'; // Import your TranscriptionComponent

const STTComponent = () => {
  const [audioBlob, setAudioBlob] = useState(null);

  return (
    <div>
      <RecordComponent setAudioBlob={setAudioBlob} />
      {audioBlob && <TranscriptionComponent audioBlob={audioBlob} />}
    </div>
  );
};

export default STTComponent;
