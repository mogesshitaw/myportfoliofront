// components/chat/ChatAgent.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import {
    Paper,
    Stack,
    Text,
    TextInput,
    Button,
    ScrollArea,
    Avatar,
    Group,
    ActionIcon,
    Box,
    Loader,
    Divider,
    useMantineTheme,
    useMantineColorScheme,
    rem,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconMessage,
    IconX,
    IconMinus,
    IconMaximize,
    IconSend,
    IconTrash,
    IconRobot,
    IconUser,
} from '@tabler/icons-react';

const ChatAgent: React.FC = () => {
    const {
        messages,
        isLoading,
        isOpen,
        isMinimized,
        sendMessage,
        toggleChat,
        toggleMinimize,
        clearHistory,
    } = useChat();

    const [inputMessage, setInputMessage] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

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

    if (!isOpen) {
        return (
            <Tooltip label="Chat with AI Assistant" position="left">
                <ActionIcon
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                    size="xl"
                    radius="xl"
                    onClick={toggleChat}
                    style={{
                        position: 'fixed',
                        bottom: rem(20),
                        right: rem(20),
                        zIndex: 1000,
                        boxShadow: theme.shadows.lg,
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <IconMessage size={24} />
                </ActionIcon>
            </Tooltip>
        );
    }

    return (
        <Paper
            shadow="xl"
            radius="lg"
            style={{
                position: 'fixed',
                bottom: rem(20),
                right: rem(20),
                width: isMinimized ? rem(320) : rem(380),
                height: isMinimized ? 'auto' : rem(550),
                zIndex: 1000,
                overflow: 'hidden',
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
                transition: 'all 0.3s ease',
            }}
        >
            {/* Header */}
            <Box
                style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    padding: rem(12),
                    color: 'white',
                }}
            >
                <Group justify="space-between">
                    <Group gap="xs">
                        <Avatar size="sm" radius="xl" color="blue">
                            <IconRobot size={18} />
                        </Avatar>
                        <div>
                            <Text size="sm" fw={600}>AI Assistant</Text>
                            <Text size="xs" opacity={0.8}>Online</Text>
                        </div>
                    </Group>
                    <Group gap="xs">
                        <ActionIcon
                            variant="transparent"
                            color="white"
                            size="sm"
                            onClick={toggleMinimize}
                        >
                            {isMinimized ? <IconMaximize size={16} /> : <IconMinus size={16} />}
                        </ActionIcon>
                        <ActionIcon
                            variant="transparent"
                            color="white"
                            size="sm"
                            onClick={toggleChat}
                        >
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Box>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <ScrollArea
                        style={{ height: rem(420), padding: rem(12) }}
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
                                    <Paper
                                        p="xs"
                                        radius="md"
                                        style={{
                                            maxWidth: '70%',
                                            backgroundColor:
                                                message.type === 'user'
                                                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                                    : isDark
                                                    ? theme.colors.dark[5]
                                                    : theme.colors.gray[1],
                                            color:
                                                message.type === 'user'
                                                    ? 'green'
                                                    : isDark
                                                    ? theme.colors.dark[0]
                                                    : theme.colors.gray[8],
                                        }}
                                    >
                                        <Text size="sm">{message.content}</Text>
                                        <Text size="xs" opacity={0.7} mt={4}>
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Text>
                                    </Paper>
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
                                    <Paper p="xs" radius="md" bg={isDark ? theme.colors.dark[5] : theme.colors.gray[1]}>
                                        <Loader size="xs" />
                                    </Paper>
                                </Group>
                            )}
                        </Stack>
                    </ScrollArea>

                    <Divider />

                    {/* Input */}
                    <Box p="md">
                        <Group gap="xs" align="flex-end">
                            <TextInput
                                ref={inputRef}
                                placeholder="Ask me anything..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.currentTarget.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                style={{ flex: 1 }}
                                radius="xl"
                                size="sm"
                            />
                            <ActionIcon
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                                size="md"
                                radius="xl"
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                            >
                                <IconSend size={16} />
                            </ActionIcon>
                            <ActionIcon
                                variant="subtle"
                                color="red"
                                size="md"
                                radius="xl"
                                onClick={clearHistory}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default ChatAgent;