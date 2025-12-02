import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, History } from "lucide-react";
import { Button } from "./ui/button";
import { processData } from "../services/api";
// Removed auth requirement for chatbot

interface AIChatbotProps {
  initialData: Record<string, any>[];
  initialColumns: string[];
  onDataUpdate: (newResult: any) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CHAT_HISTORY_KEY = 'ai-chatbot-history';
const CHAT_DATA_KEY = 'ai-chatbot-data';

export function AIChatbot({ initialData, initialColumns, onDataUpdate }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(true); // Default to open
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentData, setCurrentData] = useState(initialData);
  const [currentColumns, setCurrentColumns] = useState(initialColumns);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem(CHAT_HISTORY_KEY);
      const savedData = sessionStorage.getItem(CHAT_DATA_KEY);
      
      if (savedHistory) {
        const parsedMessages = JSON.parse(savedHistory);
        console.log('📥 Loading messages from sessionStorage:', parsedMessages.length, 'messages');
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
        console.log('✅ Messages loaded:', messagesWithDates.map(m => `${m.role}: ${m.content.substring(0, 50)}...`));
      } else {
        // Only show initial greeting if no history exists
        const initialMessage = {
          id: "1",
          role: "assistant" as const,
          content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
        console.log('📝 No saved history, showing initial greeting');
      }

      // Load saved data if available
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.data && parsedData.columns) {
          setCurrentData(parsedData.data);
          setCurrentColumns(parsedData.columns);
        }
      }
      
      setIsHistoryLoaded(true);
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Fallback to initial greeting
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
          timestamp: new Date(),
        },
      ]);
      setIsHistoryLoaded(true);
    }
  }, []);

  // Save chat history to sessionStorage whenever messages change
  useEffect(() => {
    if (isHistoryLoaded && messages.length > 0) {
      try {
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [messages, isHistoryLoaded]);

  // Save current data to sessionStorage whenever it changes
  useEffect(() => {
    if (isHistoryLoaded && currentData.length > 0) {
      try {
        sessionStorage.setItem(CHAT_DATA_KEY, JSON.stringify({
          data: currentData,
          columns: currentColumns,
        }));
      } catch (error) {
        console.error('Error saving chat data:', error);
      }
    }
  }, [currentData, currentColumns, isHistoryLoaded]);

  const PROCESSING_MESSAGES = [
    "Analyzing your request...",
    "Processing your data with AI...",
    "Applying transformations...",
    "Generating results...",
    "Almost done...",
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Rotate loading messages while processing
  useEffect(() => {
    if (!isProcessing) {
      setLoadingMessage("");
      return;
    }

    let messageIndex = 0;
    setLoadingMessage(PROCESSING_MESSAGES[0]);

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % PROCESSING_MESSAGES.length;
      setLoadingMessage(PROCESSING_MESSAGES[messageIndex]);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Update data when initialData changes (but only if it's a new file, not just a remount)
  useEffect(() => {
    if (isHistoryLoaded) {
      // Check if this is a completely new dataset (different number of rows/columns)
      // If it's the same dataset, keep the current data (which might have been modified)
      const savedData = sessionStorage.getItem(CHAT_DATA_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Only update if it's clearly a different file (different structure)
          const isNewFile = 
            parsed.data.length !== initialData.length ||
            parsed.columns.length !== initialColumns.length ||
            JSON.stringify(parsed.columns) !== JSON.stringify(initialColumns);
          
          if (isNewFile) {
            // New file uploaded - update data and optionally clear history
            setCurrentData(initialData);
            setCurrentColumns(initialColumns);
          }
          // Otherwise, keep the saved data (which includes any modifications from chat)
        } catch (error) {
          // If parsing fails, use initial data
          setCurrentData(initialData);
          setCurrentColumns(initialColumns);
        }
      } else {
        // No saved data, use initial data
        setCurrentData(initialData);
        setCurrentColumns(initialColumns);
      }
    }
  }, [initialData, initialColumns, isHistoryLoaded]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Immediately update state and save to sessionStorage synchronously
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      // Save immediately to sessionStorage
      try {
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
        console.log('✅ User message saved immediately:', userMessage.content);
      } catch (error) {
        console.error('Error saving user message:', error);
      }
      return newMessages;
    });
    
    const promptText = input;
    setInput("");
    setIsProcessing(true);

    try {
      const response = await processData(currentData, currentColumns, promptText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✅ Done! I've processed your request. ${response.summary?.join(" ") || "Changes applied successfully."}`,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, assistantMessage];
        // Save immediately to sessionStorage
        try {
          sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
          console.log('✅ Assistant message saved immediately');
        } catch (error) {
          console.error('Error saving assistant message:', error);
        }
        return newMessages;
      });
      
      // Update the data
      if (response.processed_data) {
        const newData = response.processed_data;
        const newColumns = response.columns || currentColumns;
        setCurrentData(newData);
        setCurrentColumns(newColumns);
        
        // Save updated data to sessionStorage
        try {
          sessionStorage.setItem(CHAT_DATA_KEY, JSON.stringify({
            data: newData,
            columns: newColumns,
          }));
        } catch (error) {
          console.error('Error saving updated data:', error);
        }
        
        onDataUpdate(response);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Error: ${error.message || "Failed to process your request. Please try again."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => {
        const newMessages = [...prev, errorMessage];
        // Save immediately to sessionStorage
        try {
          sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
        } catch (error) {
          console.error('Error saving error message:', error);
        }
        return newMessages;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestedActions = [
    { text: "Create a report", icon: "📊" },
    { text: "Extract data from PDFs/CSV", icon: "📄" },
    { text: "Generate data with AI", icon: "💡" },
  ];

  return (
    <>
      {/* Floating Button - Bottom Right Corner - Always Visible */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed w-14 h-14 bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          style={{ 
            right: '24px', 
            bottom: '24px',
            position: 'fixed',
            left: 'auto',
            zIndex: 9999, // Very high z-index to ensure it's always on top
            isolation: 'isolate' // Create new stacking context
          }}
          aria-label="Open AI Chatbot"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chatbot Sidebar - Opens upwards from bottom right - Always Visible */}
      {isOpen && (
        <div 
          className="fixed w-96 bg-white border border-gray-200 shadow-2xl flex flex-col rounded-t-lg overflow-hidden"
          style={{ 
            right: '24px', 
            bottom: '88px',
            position: 'fixed',
            left: 'auto',
            height: 'calc(100vh - 112px)', // Use full viewport height minus button space
            maxHeight: 'calc(100vh - 112px)', // Ensure it doesn't go above viewport
            zIndex: 9999, // Very high z-index to ensure it's always on top
            isolation: 'isolate' // Create new stacking context
          }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">AI Analyst</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Clear chat history? This cannot be undone.')) {
                    setMessages([
                      {
                        id: "1",
                        role: "assistant",
                        content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
                        timestamp: new Date(),
                      },
                    ]);
                    sessionStorage.removeItem(CHAT_HISTORY_KEY);
                  }
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Clear History"
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages - Fully Scrollable */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            style={{ 
              minHeight: 0, // Ensure proper scrolling
              maxHeight: '100%',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch' // Smooth scrolling on mobile
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                console.log('🎨 Rendering message:', message.role, message.content.substring(0, 50));
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-[#00A878] text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === "user" ? "text-white/70" : "text-gray-500"
                      }`}>
                        {message.role === "user" ? "You" : "AI"} • {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00A878]" />
                  <span className="text-sm text-gray-600">{loadingMessage || "Processing..."}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Actions - Only show when no messages except initial greeting */}
          {messages.length === 1 && !isProcessing && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <div className="space-y-2">
                {suggestedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(action.text)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>{action.icon}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask AI — use @ for elements"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A878] text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="p-2 bg-[#00A878] text-white rounded-lg hover:bg-[#008c67] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Build v</p>
          </div>
        </div>
      )}

    </>
  );
}

