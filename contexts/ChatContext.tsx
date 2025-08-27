import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasDiaryOffer?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  hasUnreadMessages: boolean;
  setUnreadStatus: (status: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your nutrition and fitness assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    // Mark as unread if it's a bot message
    if (!message.isUser) {
      setHasUnreadMessages(true);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hi! I'm your nutrition and fitness assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setHasUnreadMessages(false);
  };

  const setUnreadStatus = (status: boolean) => {
    setHasUnreadMessages(status);
  };

  const value: ChatContextType = {
    messages,
    addMessage,
    clearMessages,
    hasUnreadMessages,
    setUnreadStatus,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
