// contexts/ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notifications } from '@mantine/notifications';

interface ChatMessage {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: string;
}

interface ChatConversation {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatContextType {
    messages: ChatMessage[];
    isLoading: boolean;
    isOpen: boolean;
    isMinimized: boolean;
    sendMessage: (message: string) => Promise<void>;
    toggleChat: () => void;
    toggleMinimize: () => void;
    clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<ChatConversation[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            const history = JSON.parse(savedHistory);
            setMessages(history);
            setConversationHistory(history.map((msg: ChatMessage) => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            })));
        } else {
            const greeting: ChatMessage = {
                id: Date.now().toString(),
                type: 'bot',
                content: "👋 Hi! I'm Moges's AI assistant. Ask me about his skills, projects, experience, or anything you'd like to know!",
                timestamp: new Date().toISOString()
            };
            setMessages([greeting]);
            setConversationHistory([{
                role: 'assistant',
                content: greeting.content
            }]);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    const sendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setConversationHistory(prev => [
            ...prev,
            { role: 'user', content: message }
        ]);
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: conversationHistory
                })
            });

            const data = await response.json();

            if (data.success) {
                const botMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    content: data.data.message,
                    timestamp: data.data.timestamp
                };
                setMessages(prev => [...prev, botMessage]);
                setConversationHistory(prev => [
                    ...prev,
                    { role: 'assistant', content: data.data.message }
                ]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to send message. Please try again.',
                color: 'red',
            });
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: "Sorry, I'm having trouble connecting. Please try again later or email mogesshitaw7702@gmail.com directly.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsMinimized(false);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const clearHistory = () => {
        localStorage.removeItem('chatHistory');
        const greeting: ChatMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: "👋 Hi! I'm Moges's AI assistant. Ask me about his skills, projects, experience, or anything you'd like to know!",
            timestamp: new Date().toISOString()
        };
        setMessages([greeting]);
        setConversationHistory([{
            role: 'assistant',
            content: greeting.content
        }]);
        notifications.show({
            title: 'Success',
            message: 'Chat history cleared!',
            color: 'green',
        });
    };

    return (
        <ChatContext.Provider value={{
            messages,
            isLoading,
            isOpen,
            isMinimized,
            sendMessage,
            toggleChat,
            toggleMinimize,
            clearHistory
        }}>
            {children}
        </ChatContext.Provider>
    );
};