import { useState, useEffect } from 'react';

const PROCESSING_MESSAGES = [
  "Hi, human. Act busy.",
  "Back again? Cool. I'll work, you pretend.",
  "First time? Nice. Look productive.",
  "Grab your bean bag.",
  "Lean back. Your mess is mine now.",
  "Crunching numbers. You take the credit.",
  "Great team work. mostly mine.",
  "Sip something. you earned it",
  "Almost done.",
  "Finished. You're welcome.",
  "Lazy mode on.",
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

