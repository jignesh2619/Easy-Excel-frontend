import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, History } from "lucide-react";
import { Button } from "./ui/button";
import { processData } from "../services/api";
// Removed auth requirement for chatbot

interface AIChatbotProps {
  initialData: Record<string, any>[];
  initialColumns: string[];
  onDataUpdate: (newResult: any) => void;
  isDashboard?: boolean; // True if on dashboard page, false if on preview page
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  summary?: string[]; // Optional summary array for animated display
}

const CHAT_HISTORY_KEY = 'ai-chatbot-history';
const CHAT_DATA_KEY = 'ai-chatbot-data';

// Animated Summary Component - Shows operations one by one
function AnimatedSummary({ items }: { items: string[] }) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    // Reset and animate items one by one
    setVisibleItems([]);
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * 300); // 300ms delay between each item
    });
  }, [items]);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 transition-all duration-500 ${
            visibleItems.includes(index)
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4'
          }`}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
        >
          <span className="text-[#00A878] mt-0.5 flex-shrink-0">•</span>
          <span className="text-sm text-gray-700 flex-1">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function AIChatbot({ initialData, initialColumns, onDataUpdate, isDashboard = false }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(true); // Default to open
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentData, setCurrentData] = useState(initialData);
  const [currentColumns, setCurrentColumns] = useState(initialColumns);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem(CHAT_HISTORY_KEY);
      const savedData = sessionStorage.getItem(CHAT_DATA_KEY);
      
      if (savedHistory) {
        const parsedMessages = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        // Ensure we have at least one message
        if (messagesWithDates.length > 0) {
          setMessages(messagesWithDates);
        } else {
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // Only show initial greeting if no history exists
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: "Hi, can I help you get started? I can help you make further changes to your processed sheet.",
            timestamp: new Date(),
          },
        ]);
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

  // Update currentData when initialData prop changes (e.g., when parent updates previewData)
  useEffect(() => {
    if (initialData && initialData.length > 0 && JSON.stringify(initialData) !== JSON.stringify(currentData)) {
      setCurrentData(initialData);
      setCurrentColumns(initialColumns);
    }
  }, [initialData, initialColumns]);

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
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
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

    setMessages((prev) => [...prev, userMessage]);
    const promptText = input;
    setInput("");
    setIsProcessing(true);

    try {
      // Pass is_dashboard context to backend
      const response = await processData(currentData, currentColumns, promptText, isDashboard);
      
      // Create message with summary for animated display
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `✅ Done! I've processed your request.`,
        summary: response.summary || [], // Store summary separately for animation
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Check if response contains chart configurations
      const actionPlan = response.action_plan;
      if (actionPlan) {
        const chartConfig = actionPlan.chart_config;
        const chartConfigs = actionPlan.chart_configs;
        
        if (chartConfig || chartConfigs) {
          // Store dashboard data
          const charts = chartConfigs 
            ? chartConfigs.map((c: any) => ({
                chart_type: c.chart_type || 'bar',
                x_column: c.x_column,
                y_column: c.y_column,
                title: c.title,
                description: c.description,
              }))
            : chartConfig 
              ? [{
                  chart_type: chartConfig.chart_type || 'bar',
                  x_column: chartConfig.x_column,
                  y_column: chartConfig.y_column,
                  title: chartConfig.title,
                  description: chartConfig.description,
                }]
              : [];

          if (charts.length > 0) {
            const dashboardData = {
              id: Date.now().toString(),
              title: `Dashboard ${Date.now()}`,
              charts,
              data: response.processed_data || currentData,
              columns: response.columns || currentColumns,
              createdAt: new Date().toISOString(),
            };

            // Load existing dashboards
            const existingDashboards = (() => {
              try {
                const stored = sessionStorage.getItem('dashboard-data');
                return stored ? JSON.parse(stored) : [];
              } catch {
                return [];
              }
            })();

            // Add new dashboard
            const updatedDashboards = [...existingDashboards, dashboardData];
            sessionStorage.setItem('dashboard-data', JSON.stringify(updatedDashboards));
          }
        }
      }
      
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
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <>
      {/* Floating Button - Bottom Right Corner - Always Visible */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[#00A878] to-[#00c98c] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          style={{ 
            right: isMobile ? '12px' : '24px',
            bottom: isMobile ? '12px' : '24px',
            position: 'fixed',
            left: 'auto',
            zIndex: 99999, // Very high z-index to ensure it's always on top
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
          className="fixed bg-white border border-gray-200 shadow-2xl flex flex-col rounded-t-lg"
          style={{ 
            right: isMobile ? '8px' : '24px',
            left: isMobile ? '8px' : 'auto',
            bottom: isMobile ? '80px' : '88px',
            position: 'fixed',
            width: isMobile ? 'calc(100vw - 16px)' : '384px',
            maxWidth: isMobile ? 'calc(100vw - 16px)' : '384px',
            height: isMobile ? 'calc(100vh - 96px)' : 'calc(100vh - 112px)',
            maxHeight: isMobile ? 'calc(100vh - 96px)' : 'calc(100vh - 112px)',
            zIndex: 99999,
            isolation: 'isolate',
            display: 'flex',
            flexDirection: 'column',
            visibility: 'visible',
            opacity: 1
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
            className="flex-1 overflow-y-auto p-4 bg-gray-50"
            style={{ 
              flex: '1 1 0%',
              minHeight: '400px',
              height: '100%',
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              visibility: 'visible',
              opacity: 1,
              position: 'relative',
              zIndex: 1
            }}
          >
            {messages && messages.length > 0 ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px', 
                width: '100%', 
                paddingBottom: '20px',
                minHeight: '100%'
              }}>
                {messages.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className="flex"
                      style={{ 
                        width: '100%',
                        flexShrink: 0,
                        marginBottom: '16px',
                        visibility: 'visible',
                        opacity: 1,
                        display: 'flex',
                        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                        minHeight: 'auto',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      <div
                        className={`rounded-lg ${
                          message.role === "user"
                            ? "bg-white"
                            : "bg-white text-gray-800 border border-gray-200 shadow-sm max-w-[80%]"
                        }`}
                        style={{
                          visibility: 'visible',
                          opacity: 1,
                          display: 'block',
                          wordWrap: 'break-word',
                          minHeight: 'auto',
                          position: 'relative',
                          zIndex: 1,
                          boxSizing: 'border-box',
                          backgroundColor: message.role === "user" ? "#ffffff" : "#ffffff",
                          color: message.role === "user" ? "#000000" : "#1f2937",
                          border: message.role === "user" ? "1px solid #e5e7eb" : "1px solid #e5e7eb",
                          boxShadow: message.role === "user" ? "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
                          maxWidth: message.role === "user" ? "90%" : "80%",
                          padding: message.role === "user" ? "14px 16px" : "12px"
                        }}
                      >
                        <div>
                          <p 
                            className="text-sm whitespace-pre-wrap break-words" 
                            style={{ 
                              visibility: 'visible', 
                              opacity: 1, 
                              color: message.role === "user" ? "#000000" : "#1f2937",
                              margin: 0,
                              padding: 0,
                              marginBottom: message.summary && message.summary.length > 0 ? '12px' : 0,
                              lineHeight: '1.5',
                              position: 'relative',
                              zIndex: 1,
                              fontWeight: 'normal'
                            }}
                          >
                            {message.content}
                          </p>
                          {message.summary && message.summary.length > 0 && (
                            <AnimatedSummary items={message.summary} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8" style={{ visibility: 'visible', opacity: 1 }}>
                No messages yet. Start a conversation!
              </div>
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


