export const recordStart = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioRecorder = new MediaRecorder(stream);

    audioRecorder.start();

    return audioRecorder; // Return the audioRecorder instance

  } catch (error) {
    console.error('Error capturing audio:', error);
  }
};

const playAudioBlob = (audioBlob) => {

      // Create a Blob URL for the audio blob
      const blobUrl = URL.createObjectURL(audioBlob);

      // Create an <audio> element
      const audioElement = new Audio(blobUrl);

      // Play the audio
      audioElement.play();

      // Release the blob URL when done (e.g., when audio playback is finished)
      audioElement.addEventListener('ended', () => {
        URL.revokeObjectURL(blobUrl);
      });
}
export const recordStop = (audioRecorder) => {
  return new Promise((resolve, reject) => {
    if (audioRecorder) {
      const audioChunks = [];
      
      audioRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob); // Resolve the Promise with the audioBlob
      };

      audioRecorder.stop();
    } else {
      reject(new Error('AudioRecorder is null.'));
    }
  });
};
