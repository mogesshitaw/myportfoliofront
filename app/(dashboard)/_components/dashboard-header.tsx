/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  IconMenu2, 
  IconSearch, 
  IconBell, 
  IconMoon, 
  IconSun, 
  IconUser, 
  IconSettings, 
  IconLogout,
  IconChevronDown,
  IconMail,
  IconHeart,
  IconMessage,
  IconFolder,
  IconStar,
  IconEye,
  IconCheck
} from "@tabler/icons-react"
import { useMantineTheme, useMantineColorScheme } from "@mantine/core"
import {
  Group,
  Title,
  TextInput,
  ActionIcon,
  Menu,
  Avatar,
  Badge,
  rem,
  Flex,
  Box,
  Text,
  Indicator,
  Loader,
  ScrollArea,
  Divider,
} from "@mantine/core"
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'

interface DashboardHeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string | null;
  isRead: boolean;
  data: any;
  createdAt: string;
  projectId?: string;
}

export function DashboardHeader({ onMenuClick, isMobile }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'
  
  // Get auth data
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    // Fetch notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true)
      const response = await apiClient.get('/notifications?limit=5')
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all')
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getPageTitle = () => {
    if (pathname?.includes("/dashboard")) return "Dashboard"
    if (pathname?.includes("/projects")) return "Projects"
    if (pathname?.includes("/chat")) return "Messages"
    if (pathname?.includes("/users")) return "User Management"
    if (pathname?.includes("/settings")) return "Settings"
    if (pathname?.includes("/profile")) return "Profile"
    if (pathname?.includes("/notifications")) return "Notifications"
    return "Dashboard"
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return <IconUser size={16} color={theme.colors.blue[6]} />
      case 'project_created':
        return <IconFolder size={16} color={theme.colors.green[6]} />
      case 'new_comment':
        return <IconMessage size={16} color={theme.colors.grape[6]} />
      case 'new_like':
        return <IconHeart size={16} color={theme.colors.red[6]} />
      case 'new_message':
        return <IconMail size={16} color={theme.colors.orange[6]} />
      case 'contact_message':
        return <IconStar size={16} color={theme.colors.yellow[6]} />
      default:
        return <IconBell size={16} />
    }
  }

  // Show loading state during SSR
  if (!mounted || isLoading) {
    return (
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          backgroundColor: 'white',
        }}
      >
        <Flex h={70} px="md" align="center" justify="space-between">
          <Group gap="xs">
            {isMobile && <ActionIcon variant="subtle" size="lg" />}
            <Title order={3} fw={600} size="h4">Dashboard</Title>
          </Group>
          <Group gap="xs">
            <Loader size="sm" />
          </Group>
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      component="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        backgroundColor: isDark ? theme.colors.dark[7] : 'white',
      }}
    >
      <Flex h={70} px="md" align="center" justify="space-between">
        {/* Left Section */}
        <Group gap="xs">
          {/* Mobile Menu Button */}
          {isMobile && (
            <ActionIcon 
              variant="subtle" 
              size="lg" 
              onClick={onMenuClick}
              color={isDark ? 'gray.4' : 'dark.6'}
            >
              <IconMenu2 size={20} />
            </ActionIcon>
          )}
          
          <Title 
            order={3} 
            fw={600} 
            size="h4"
            c={isDark ? 'white' : 'dark.9'}
          >
            {getPageTitle()}
          </Title>
        </Group>

        {/* Right Section */}
        <Group gap="xs">
          {/* Search - Desktop */}
          <Box visibleFrom="sm">
            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              size="sm"
              w={250}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                  border: 'none',
                  color: isDark ? 'white' : 'black',
                  '&:focus': {
                    backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                  },
                  '&::placeholder': {
                    color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                  },
                },
              }}
            />
          </Box>

          {/* Search - Mobile */}
          <ActionIcon 
            variant="subtle" 
            size="lg" 
            hiddenFrom="sm"
            color={isDark ? 'gray.4' : 'dark.6'}
          >
            <IconSearch size={20} />
          </ActionIcon>

          {/* Theme Toggle */}
          <ActionIcon
            variant="subtle"
            size="lg"
            onClick={() => toggleColorScheme()}
            color={isDark ? 'yellow' : 'dark.6'}
          >
            {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>

          {/* Notifications Dropdown */}
          <Menu position="bottom-end" offset={5} width={380}>
            <Menu.Target>
              <ActionIcon 
                variant="subtle" 
                size="lg" 
                style={{ position: 'relative' }}
                color={isDark ? 'gray.4' : 'dark.6'}
              >
                <Indicator
                  inline
                  label={unreadCount}
                  size={18}
                  color="red"
                  disabled={unreadCount === 0}
                  styles={{
                    indicator: {
                      transform: 'translate(25%, -25%)',
                    },
                  }}
                >
                  <IconBell size={20} />
                </Indicator>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                maxHeight: 500,
              }}
            >
              <Menu.Label 
                style={{
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    <IconCheck size={14} />
                  </ActionIcon>
                )}
              </Menu.Label>
              
              <Divider />
              
              {notificationsLoading && notifications.length === 0 ? (
                <Box p="md" ta="center">
                  <Loader size="sm" />
                </Box>
              ) : notifications.length === 0 ? (
                <Box p="md" ta="center">
                  <IconBell size={32} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} />
                  <Text size="sm" c="dimmed" mt={4}>
                    No notifications
                  </Text>
                </Box>
              ) : (
                <ScrollArea style={{ maxHeight: 400 }}>
                  {notifications.map((notification) => (
                    <Menu.Item
                      key={notification.id}
                      style={{
                        padding: '12px',
                        backgroundColor: !notification.isRead 
                          ? (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                          : 'transparent',
                        borderLeft: `3px solid ${!notification.isRead ? theme.colors.blue[6] : 'transparent'}`,
                        '&:hover': {
                          backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                        },
                      }}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id)
                        }
                        if (notification.projectId) {
                          router.push(`/projects/${notification.projectId}`)
                        }
                      }}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Box>
                          {getNotificationIcon(notification.type)}
                        </Box>
                        <Box style={{ flex: 1 }}>
                          <Group justify="space-between" wrap="nowrap">
                            <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                              {notification.title}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </Text>
                          </Group>
                          {notification.content && (
                            <Text size="xs" c="dimmed" lineClamp={2} mt={2}>
                              {notification.content}
                            </Text>
                          )}
                          {notification.projectId && (
                            <Text size="xs" c="blue.6" mt={2}>
                              View project →
                            </Text>
                          )}
                        </Box>
                        {!notification.isRead && (
                          <Badge size="xs" color="blue" variant="light">
                            New
                          </Badge>
                        )}
                      </Group>
                    </Menu.Item>
                  ))}
                </ScrollArea>
              )}

              <Menu.Divider 
                style={{
                  borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              />
              
              <Menu.Item
                component={Link}
                href="/notifications"
                style={{
                  color: isDark ? theme.colors.blue[4] : theme.colors.blue[6],
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  },
                }}
              >
                <Group gap="xs">
                  <IconEye size={16} />
                  <Text size="sm">View all notifications</Text>
                </Group>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* User Menu */}
          <Menu position="bottom-end" offset={5}>
            <Menu.Target>
              <ActionIcon 
                variant="subtle" 
                size="lg" 
                style={{ 
                  padding: 0,
                  border: `2px solid ${isDark ? theme.colors.blue[8] : theme.colors.blue[5]}`,
                  borderRadius: '50%',
                }}
              >
                <Avatar
                  src={user?.avatarUrl}
                  size="md"
                  radius="xl"
                  color="blue"
                >
                  {getUserInitial()}
                </Avatar>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                width: 240,
                backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
              }}
            >
              <Menu.Label
                style={{
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                }}
              >
                <Box>
                  <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>
                    {user?.fullName || 'User'}
                  </Text>
                  <Text size="xs" c="dimmed">{user?.email || 'user@example.com'}</Text>
                  <Badge size="xs" color="blue" mt={4}>
                    {user?.role || 'user'}
                  </Badge>
                </Box>
              </Menu.Label>
              <Menu.Divider 
                style={{
                  borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              />
              
              <Menu.Item
                component={Link}
                href="/profile"
                leftSection={<IconUser size={16} />}
                style={{
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  },
                }}
              >
                Profile
              </Menu.Item>
              
              <Menu.Item
                component={Link}
                href="/settings"
                leftSection={<IconSettings size={16} />}
                style={{
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  },
                }}
              >
                Settings
              </Menu.Item>
              
              <Menu.Divider 
                style={{
                  borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              />
              
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
                style={{
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.red[9] : theme.colors.red[1],
                  },
                }}
              >
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </Box>
  )
}