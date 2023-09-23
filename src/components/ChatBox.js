import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

const apiKey = "4c6ec3b3869712603101fd74f91ac9f9"; // Replace with your Eleven Labs API key
const customVoiceId = "IirqSV9Elx6z4G8seJDT"; // Replace with your custom voice ID

const ChatBox = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const audioElementsRef = useRef({}); // Keep track of audio elements for each message
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [audioData, setAudioData] = useState({}); // Keep track of audio data for each message
  const [isPaused, setIsPaused] = useState(false);

// Automatically start playing new GPT responses
useEffect(() => {
  const latestMessageIndex = messages.length - 1;
  const latestAudioElement = audioElementsRef.current[latestMessageIndex];
  if (latestAudioElement) {
    latestAudioElement.play();
    setIsPlaying(true);
    setPlayingIndex(latestMessageIndex);
  }
}, [messages]);

// Function to handle Play button
const handlePlay = (index) => {
  const audioElement = audioElementsRef.current[index];
  if (audioElement) {
    audioElement.play();
    setIsPlaying(true);
    setPlayingIndex(index);
  }
};

// Function to handle Pause button
const handlePause = (index) => {
  const audioElement = audioElementsRef.current[index];
  if (audioElement) {
    audioElement.pause();
    setIsPaused(true);
  }
};

// Function to handle Stop button
const handleStop = (index) => {
  const audioElement = audioElementsRef.current[index];
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    setIsPlaying(false);
    setPlayingIndex(-1);
  }
};

// Update Play button state when audio ends
const handleAudioEnd = (index) => {
  setIsPlaying(false);
  setPlayingIndex(-1);
};
  const requestElevenLabsTTS = async (text, index) => {
    try {
      const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${customVoiceId}`;
      
      // Define the request data object
      const requestData = {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 1,
          use_speaker_boost: true
        }
      };

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audioElement = audioElementsRef.current[index];
      audioElement.src = audioUrl;

      if (isPaused && playingIndex === index) {
        audioElement.currentTime = audioElement.currentTime;
      } else {
        audioElement.currentTime = 0;
      }

      audioElement.play();
      audioElement.playbackRate = 1;

      setIsPlaying(true);
      setIsPaused(false);
      setPlayingIndex(index);
    } catch (error) {
      console.error('Error requesting Eleven Labs TTS:', error);
    }
  };

  const pauseAudio = () => {
    const audioElement = audioElementsRef.current[playingIndex];
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const stopAudio = () => {
    const audioElement = audioElementsRef.current[playingIndex];
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const togglePlayPause = (index) => {
    if (isPlaying && playingIndex === index) {
      pauseAudio();
    } else {
      requestElevenLabsTTS(messages[index], index);
    }
  };

  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div key={index} className={message.startsWith('User:') ? 'user-message' : 'gpt-message'}>
          {message}
          <div className="audio-controls">
            <button className="audio-button" onClick={() => togglePlayPause(index)}>
              {isPlaying && playingIndex === index ? (
                isPaused ? <FaPlay /> : <FaPause />
              ) : (
                <FaPlay />
              )}{' '}
            </button>
            <button className="audio-button" onClick={stopAudio}>
              <FaStop />
            </button>
          </div>
          {/* Audio element for playback */}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
