import { useState, useEffect } from 'react';

const PROCESSING_MESSAGES = [
  "✨ Analyzing your data structure...",
  "🤖 Processing with advanced AI...",
  "🔍 Generating insights and transformations...",
  "⚡ Optimizing data operations...",
  "📊 Creating beautiful visualizations...",
  "🎯 Preparing your results...",
  "🚀 Almost done, finalizing output...",
];

export function useProcessingMessages(isProcessing: boolean) {
  const [currentMessage, setCurrentMessage] = useState(PROCESSING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setMessageIndex(0);
      setCurrentMessage(PROCESSING_MESSAGES[0]);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = (prev + 1) % PROCESSING_MESSAGES.length;
        setCurrentMessage(PROCESSING_MESSAGES[next]);
        return next;
      });
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, [isProcessing]);

  return currentMessage;
}

