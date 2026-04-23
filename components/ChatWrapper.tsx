// components/ChatWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatAgent with ssr: false (only works in client components)
const ChatAgent = dynamic(() => import('./chat/ChatAgent'), {
    ssr: false,
    loading: () => null
});

export default function ChatWrapper() {
    return <ChatAgent />;
}