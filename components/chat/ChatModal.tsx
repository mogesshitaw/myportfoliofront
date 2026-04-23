// components/chat/ChatModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Modal,
    TextInput,
    Button,
    ScrollArea,
    Group,
    Avatar,
    Text,
    Stack,
    Loader,
    ActionIcon,
    Divider,
    Box,
    useMantineTheme,
    useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
    IconSend, 
    IconTrash, 
    IconRobot, 
    IconUser,
    IconX 
} from '@tabler/icons-react';
import { useChat } from '@/contexts/ChatContext';

interface ChatModalProps {
    opened: boolean;
    onClose: () => void;
}

export default function ChatModal({ opened, onClose }: ChatModalProps) {
    const {
        messages,
        isLoading,
        sendMessage,
        clearHistory,
    } = useChat();

    const [inputMessage, setInputMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    // Focus input when modal opens
    useEffect(() => {
        if (opened && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [opened]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;
        const message = inputMessage;
        setInputMessage('');
        await sendMessage(message);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <Avatar size="sm" radius="xl" color="blue">
                        <IconRobot size={16} />
                    </Avatar>
                    <div>
                        <Text size="sm" fw={600}>AI Assistant</Text>
                        <Text size="xs" c="dimmed">Online - Ask me anything!</Text>
                    </div>
                </Group>
            }
            size="lg"
            padding="md"
            radius="md"
            styles={{
                body: {
                    padding: 0,
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            {/* Messages Container */}
            <ScrollArea
                style={{ flex: 1, padding: '16px' }}
                viewportRef={scrollAreaRef}
            >
                <Stack gap="md">
                    {messages.map((message) => (
                        <Group
                            key={message.id}
                            justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
                            align="flex-start"
                            wrap="nowrap"
                        >
                            {message.type === 'bot' && (
                                <Avatar size="sm" radius="xl" color="blue">
                                    <IconRobot size={14} />
                                </Avatar>
                            )}
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    backgroundColor:
                                        message.type === 'user'
                                            ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                            : isDark
                                            ? '#2C2E33'
                                            : '#F1F3F5',
                                    color:
                                        message.type === 'user'
                                            ? 'white'
                                            : isDark
                                            ? 'white'
                                            : 'black',
                                }}
                            >
                                <Text size="sm">{message.content}</Text>
                                <Text size="xs" opacity={0.7} mt={4}>
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </div>
                            {message.type === 'user' && (
                                <Avatar size="sm" radius="xl" color="grape">
                                    <IconUser size={14} />
                                </Avatar>
                            )}
                        </Group>
                    ))}
                    {isLoading && (
                        <Group justify="flex-start" align="flex-start" wrap="nowrap">
                            <Avatar size="sm" radius="xl" color="blue">
                                <IconRobot size={14} />
                            </Avatar>
                            <div
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: isDark ? '#2C2E33' : '#F1F3F5',
                                }}
                            >
                                <Loader size="xs" />
                            </div>
                        </Group>
                    )}
                </Stack>
            </ScrollArea>

            <Divider />

            {/* Input Area */}
            <Box p="md">
                <Group gap="xs" align="flex-end">
                    <TextInput
                        ref={inputRef}
                        placeholder="Ask me about Moges's skills, projects, experience..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.currentTarget.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                        radius="xl"
                        size="md"
                    />
                    <Button
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                        radius="xl"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        loading={isLoading}
                    >
                        <IconSend size={18} />
                    </Button>
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        radius="xl"
                        onClick={clearHistory}
                        size="md"
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Group>
                <Text size="xs" c="dimmed" mt={8} ta="center">
                    💡 Ask about skills, projects, experience, or contact information
                </Text>
            </Box>
        </Modal>
    );
}