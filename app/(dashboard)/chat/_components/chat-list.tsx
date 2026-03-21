'use client'

import { useState } from 'react'
import { Avatar, Box, Text, Group, Badge, ScrollArea, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { IconCircleCheck, IconCircle } from '@tabler/icons-react'

interface Conversation {
  id: string
  user: {
    name: string
    avatar?: string
    online: boolean
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

const conversations: Conversation[] = [
  {
    id: '1',
    user: { name: 'John Smith', online: true },
    lastMessage: 'I have a question about the project...',
    lastMessageTime: '5m',
    unreadCount: 2,
  },
  {
    id: '2',
    user: { name: 'Sarah Johnson', online: false },
    lastMessage: 'The design looks great!',
    lastMessageTime: '1h',
    unreadCount: 0,
  },
  {
    id: '3',
    user: { name: 'Mike Wilson', online: true },
    lastMessage: 'Can you review the code?',
    lastMessageTime: '2h',
    unreadCount: 1,
  },
]

export function ChatList() {
  const [selectedChat, setSelectedChat] = useState<string>('1')
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <ScrollArea style={{ height: 'calc(100vh - 12rem)' }} type="hover">
      <Box>
        {conversations.map((chat) => {
          const isSelected = selectedChat === chat.id
          
          return (
            <Box
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: theme.spacing.sm,
                padding: theme.spacing.md,
                cursor: 'pointer',
                backgroundColor: isSelected 
                  ? (isDark ? theme.colors.dark[5] : theme.colors.gray[1])
                  : 'transparent',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              }}
            >
              {/* Avatar with online status */}
              <Box style={{ position: 'relative' }}>
                <Avatar
                  src={chat.user.avatar}
                  radius="xl"
                  size="md"
                  color="blue"
                >
                  {chat.user.name[0]}
                </Avatar>
                {chat.user.online && (
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: theme.colors.green[6],
                      border: `2px solid ${isDark ? theme.colors.dark[7] : 'white'}`,
                    }}
                  />
                )}
              </Box>

              {/* Message content */}
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Group justify="space-between" wrap="nowrap">
                  <Text 
                    size="sm" 
                    fw={500} 
                    truncate="end"
                    c={isDark ? 'white' : 'dark.9'}
                  >
                    {chat.user.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {chat.lastMessageTime}
                  </Text>
                </Group>
                <Text 
                  size="sm" 
                  c="dimmed" 
                  truncate="end"
                  style={{ maxWidth: '100%' }}
                >
                  {chat.lastMessage}
                </Text>
              </Box>

              {/* Unread count badge */}
              {chat.unreadCount > 0 && (
                <Badge
                  color="blue"
                  variant="filled"
                  size="sm"
                  style={{
                    minWidth: 20,
                    height: 20,
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {chat.unreadCount}
                </Badge>
              )}
            </Box>
          )
        })}
      </Box>
    </ScrollArea>
  )
}