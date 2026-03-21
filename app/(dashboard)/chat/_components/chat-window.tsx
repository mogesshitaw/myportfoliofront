'use client'

import { useState } from 'react'
import {
  Box,
  Text,
  Avatar,
  TextInput,
  Button,
  Group,
  Stack,
  Paper,
  ScrollArea,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconSend } from '@tabler/icons-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'other'
  time: string
}

const messages: Message[] = [
  {
    id: '1',
    content: 'Hi, I have a question about the e-commerce project',
    sender: 'other',
    time: '10:30 AM',
  },
  {
    id: '2',
    content: 'Sure, what would you like to know?',
    sender: 'user',
    time: '10:32 AM',
  },
  {
    id: '3',
    content: 'When can we expect the first prototype?',
    sender: 'other',
    time: '10:33 AM',
  },
]

export function ChatWindow() {
  const [newMessage, setNewMessage] = useState('')
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const handleSend = () => {
    if (!newMessage.trim()) return
    // Add send logic here
    setNewMessage('')
  }

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: isDark ? theme.colors.dark[7] : 'white',
      }}
    >
      {/* Chat Header */}
      <Box
        p="md"
        style={{
          borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
        }}
      >
        <Group gap="md">
          <Avatar size="md" radius="xl" color="blue">
            JS
          </Avatar>
          <Box>
            <Text fw={500} size="md" c={isDark ? 'white' : 'dark.9'}>
              John Smith
            </Text>
            <Group gap={4} align="center">
              <Box
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.colors.green[6],
                }}
              />
              <Text size="xs" c="green.6">
                Online
              </Text>
            </Group>
          </Box>
        </Group>
      </Box>

      {/* Messages */}
      <ScrollArea style={{ flex: 1 }} p="md">
        <Stack gap="md">
          {messages.map((message) => {
            const isUser = message.sender === 'user'
            
            return (
              <Group
                key={message.id}
                justify={isUser ? 'flex-end' : 'flex-start'}
              >
                <Paper
                  p="xs"
                  radius="lg"
                  style={{
                    maxWidth: '70%',
                    backgroundColor: isUser
                      ? theme.colors.blue[6]
                      : (isDark ? theme.colors.dark[5] : theme.colors.gray[1]),
                    borderBottomRightRadius: isUser ? 0 : 'lg',
                    borderBottomLeftRadius: isUser ? 'lg' : 0,
                  }}
                >
                  <Text
                    size="sm"
                    c={isUser ? 'white' : (isDark ? 'gray.3' : 'dark.9')}
                  >
                    {message.content}
                  </Text>
                  <Text
                    size="xs"
                    mt={4}
                    c={isUser ? 'blue.2' : (isDark ? 'gray.5' : 'dimmed')}
                    ta={isUser ? 'right' : 'left'}
                  >
                    {message.time}
                  </Text>
                </Paper>
              </Group>
            )
          })}
        </Stack>
      </ScrollArea>

      {/* Message Input */}
      <Box
        p="md"
        style={{
          borderTop: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
        }}
      >
        <Group gap="sm">
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1 }}
            styles={{
              input: {
                backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                color: isDark ? 'white' : 'black',
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              },
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            variant="gradient"
            gradient={{ from: 'blue', to: 'grape', deg: 135 }}
            px="md"
          >
            <IconSend size={18} />
          </Button>
        </Group>
      </Box>
    </Box>
  )
}