// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatWrapper from '../components/ChatWrapper';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MsPortfolio',
    description: 'Manage Your Development Projects with Ease',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <Providers>
                    <ChatProvider>
                        {children}
                        <ChatWrapper />
                    </ChatProvider>
                </Providers>
            </body>
        </html>
    );
}