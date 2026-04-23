// types/chat.ts
export interface ChatMessage {
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: string;
}

export interface ChatConversation {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    success: boolean;
    data: {
        success: boolean;
        message: string;
        timestamp: string;
    };
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    isOpen: boolean;
    isMinimized: boolean;
}