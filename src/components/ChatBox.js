import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";

const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
const customVoiceId = "IirqSV9Elx6z4G8seJDT";

const ChatBox = ({ messages, interacted }) => {
  const messagesEndRef = useRef(null);
  const audioElementsRef = useRef({});
  const lastMessageRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Initial set up of lastMessageRef
    if (!lastMessageRef.current && messages.length) {
      lastMessageRef.current = messages[messages.length - 1];
      return; // Exit early on initial render
    }

    const latestMessageIndex = messages.length - 1;
    const latestMessage = messages[latestMessageIndex];

    if (
      interacted &&
      !latestMessage.startsWith("User:") &&
      latestMessage !== lastMessageRef.current
    ) {
      requestElevenLabsTTS(latestMessage, latestMessageIndex);
    }

    lastMessageRef.current = latestMessage;

    console.log(messagesEndRef);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interacted]);

  const handlePlay = (index) => {
    const audioElement = audioElementsRef.current[index];
    if (audioElement) {
      audioElement.play();
      setIsPlaying(true);
      setPlayingIndex(index);
    }
  };

  const handlePause = (index) => {
    const audioElement = audioElementsRef.current[index];
    if (audioElement) {
      audioElement.pause();
      setIsPaused(true);
    }
  };

  const handleStop = (index) => {
    const audioElement = audioElementsRef.current[index];
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
      setPlayingIndex(-1);
    }
  };

  const handleAudioEnd = (index) => {
    setIsPlaying(false);
    setPlayingIndex(-1);
  };

  const requestElevenLabsTTS = async (text, index) => {
    const audioElement = audioElementsRef.current[index];

    // If the audio for this message has already been generated, just play it.
    if (audioElement && audioElement.src) {
      audioElement.play();
      setIsPlaying(true);
      setIsPaused(false);
      setPlayingIndex(index);
      return; // Exit early.
    }

    try {
      const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${customVoiceId}`;
      const requestData = {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 1,
          use_speaker_boost: true,
        },
      };
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      });
      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioElement.src = audioUrl;
      audioElement.play();
      setIsPlaying(true);
      setIsPaused(false);
      setPlayingIndex(index);
    } catch (error) {
      console.error("Error requesting Eleven Labs TTS:", error);
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

  const togglePlayPause = (index) => {
    if (isPlaying && playingIndex === index) {
      pauseAudio();
    } else if (isPaused && playingIndex === index) {
      // Continue playing the paused audio.
      const audioElement = audioElementsRef.current[index];
      audioElement.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      requestElevenLabsTTS(messages[index], index);
    }
  };

  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div
          key={index}
          className={
            message.startsWith("User:") ? "user-message" : "gpt-message"
          }
        >
          {message}
          <div className="audio-controls">
            <button
              className="audio-button"
              onClick={() => togglePlayPause(index)}
            >
              {isPlaying && playingIndex === index ? (
                isPaused ? (
                  <FaPlay />
                ) : (
                  <FaPause />
                )
              ) : (
                <FaPlay />
              )}
            </button>
            <button className="audio-button" onClick={stopAudio}>
              <FaStop />
            </button>
          </div>
          <audio
            ref={(el) => (audioElementsRef.current[index] = el)}
            onEnded={() => handleAudioEnd(index)}
            onError={(e) => console.error("Audio error:", e)}
          ></audio>
        </div>
      ))}

      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatBox;
