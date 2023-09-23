import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import TextInput from './components/TextInput';
import RequestLog from './components/RequestLog';
import STTComponent from './components/STTComponent'; // Update the path
import './App.css';


import MemoryInfo from './components/MemoryInfo';


const App = () => {
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [includePrevious, setIncludePrevious] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // Initialize audioBlob as null


  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const countTokens = (text) => {
      // Split the text by spaces to approximate words
      const words = text.split(' ');

      // Count tokens (approximation)
      let tokenCount = 0;
      for (const word of words) {
        // Add 1 for the word itself
        tokenCount += 1;

        // Add 1 for each punctuation mark
        tokenCount += (word.match(/[.,!?;:]/g) || []).length;
      }

      return tokenCount;

  };

  

  const handleSendMessage = (text) => {
    setIsLoading(true);  // Set loading to true at the start of the function


    // Prepare the messages for the API request
     const apiMessages = [
    { role: "system", content: "You are a helpful assistant." },
    ...(includePrevious
      ? messages.map((message, index) => ({
          role: index % 2 === 0 ? "user" : "assistant",
          content: message.split(": ")[1],
        }))
      : []),
    { role: "user", content: text },
  ];

    // Count tokens for the entire API request
    const tokenCount = apiMessages.reduce(
      (acc, message) => acc + countTokens(message.content),
      0
    );

    axios
      .post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4", // Using GPT-4 model
        messages: apiMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      })
      .then((response) => {
        const gptResponse = response.data.choices[0].message.content.trim();
        const newMessages = [...messages, `User: ${text}`, `GPT-4: ${gptResponse}`];
        setMessages(newMessages);
        localStorage.setItem("messages", JSON.stringify(newMessages));

        setIsLoading(false);  // Set loading to false when the request is done
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);  // Set loading to false if an error occurs
      });

    // Update logs
    const newLog = {
      tokenCount: tokenCount,
      // ... (any other info you want to log)
    };
    setLogs([...logs, newLog]);
  };


  const onStartRecording = () => {
    // Your logic to start recording goes here
    setIsRecording(true);
  };

  const onStopRecording = () => {
    // Your logic to stop recording goes here
    setIsRecording(false);
  };

  console.log('app.js', audioBlob)

  return (
    <div className="container">
      <ChatBox messages={messages} />

      <div className="settings">
        <label>
          <input
            type="checkbox"
            checked={includePrevious}
            onChange={() => setIncludePrevious(!includePrevious)}
          />{' '}
          Include Previous Messages
        </label>
      </div>

      <TextInput onSendMessage={handleSendMessage} />

      {isLoading ? <div>Loading...</div> : null}

       <STTComponent /> 
       <RequestLog logs={logs} />
       <MemoryInfo />

    </div>
  );
};

export default App;
