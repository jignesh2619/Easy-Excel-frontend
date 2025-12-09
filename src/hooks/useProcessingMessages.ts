import { useState, useEffect } from 'react';

const PROCESSING_MESSAGES = [
  "Analyzing your data structure...",
  "Processing your request with advanced AI...",
  "Generating insights and transformations...",
  "Optimizing data operations...",
  "Preparing your results...",
  "Finalizing output...",
];

export function useProcessingMessages(isProcessing: boolean) {
  const [currentMessage, setCurrentMessage] = useState(PROCESSING_MESSAGES[0]);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentMessage(PROCESSING_MESSAGES[0]);
      return;
    }

    let messageIndex = 0;
    setCurrentMessage(PROCESSING_MESSAGES[0]);

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % PROCESSING_MESSAGES.length;
      setCurrentMessage(PROCESSING_MESSAGES[messageIndex]);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [isProcessing]);

  return currentMessage;
}

