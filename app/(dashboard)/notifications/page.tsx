/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Box,
  Loader,
  Center,
  Alert,
  Button,
  ActionIcon,
  Badge,
  Divider,
  useMantineTheme,
  useMantineColorScheme,
  Pagination,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconBell,
  IconCheck,
  IconTrash,
  IconMail,
  IconHeart,
  IconMessage,
  IconFolder,
  IconUser,
  IconStar,
  IconEye,
  IconDotsVertical,
  IconRefresh,
  IconAlertCircle,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

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

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/notifications';
      if (filter === 'unread') {
        url += '?unreadOnly=true';
      }
      const response = await apiClient.get(url);
      if (response.data.success) {
        setNotificationList(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.response?.data?.error || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      if (response.data.success) {
        setNotificationList(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        notifications.show({
          title: 'Success',
          message: 'Notification marked as read',
          color: 'green',
        });
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to mark as read',
        color: 'red',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiClient.patch('/notifications/read-all');
      if (response.data.success) {
        setNotificationList(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
        notifications.show({
          title: 'Success',
          message: 'All notifications marked as read',
          color: 'green',
        });
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to mark all as read',
        color: 'red',
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      if (response.data.success) {
        const wasUnread = notificationList.find(n => n.id === id)?.isRead === false;
        setNotificationList(prev => prev.filter(notif => notif.id !== id));
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        notifications.show({
          title: 'Success',
          message: 'Notification deleted',
          color: 'green',
        });
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to delete notification',
        color: 'red',
      });
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const response = await apiClient.delete('/notifications/all');
      if (response.data.success) {
        setNotificationList([]);
        setUnreadCount(0);
        notifications.show({
          title: 'Success',
          message: 'All notifications deleted',
          color: 'green',
        });
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to delete notifications',
        color: 'red',
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return <IconUser size={20} color={theme.colors.blue[6]} />;
      case 'project_created':
        return <IconFolder size={20} color={theme.colors.green[6]} />;
      case 'new_comment':
        return <IconMessage size={20} color={theme.colors.grape[6]} />;
      case 'new_like':
        return <IconHeart size={20} color={theme.colors.red[6]} />;
      case 'new_message':
        return <IconMail size={20} color={theme.colors.orange[6]} />;
      case 'contact_message':
        return <IconStar size={20} color={theme.colors.yellow[6]} />;
      default:
        return <IconBell size={20} />;
    }
  };

  const paginatedNotifications = notificationList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(notificationList.length / itemsPerPage);

  if (loading) {
    return (
      <>
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa' 
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color={isDark ? 'white' : 'blue'} />
              <Text c="dimmed">Loading notifications...</Text>
            </Stack>
          </Center>
        </Box>
      </>
    );
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>

      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" wrap="wrap">
            <div>
              <Group gap="sm">
                <IconBell size={28} color={isDark ? theme.colors.gray[3] : theme.colors.dark[6]} />
                <Title order={1} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Notifications
                </Title>
                {unreadCount > 0 && (
                  <Badge color="red" size="lg" variant="filled">
                    {unreadCount} unread
                  </Badge>
                )}
              </Group>
              <Text c="dimmed" mt={4}>
                Stay updated with your latest activity
              </Text>
            </div>
            
            <Group gap="sm">
              <Button
                variant="light"
                onClick={fetchNotifications}
                leftSection={<IconRefresh size={16} />}
                size="sm"
              >
                Refresh
              </Button>
              
              <Menu position="bottom-end" offset={5}>
                <Menu.Target>
                  <Button variant="light" size="sm">
                    Filter
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={() => setFilter('all')}>
                    All Notifications
                  </Menu.Item>
                  <Menu.Item onClick={() => setFilter('unread')}>
                    Unread Only
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              
              {unreadCount > 0 && (
                <Button
                  variant="light"
                  color="blue"
                  onClick={markAllAsRead}
                  leftSection={<IconCheck size={16} />}
                  size="sm"
                >
                  Mark all as read
                </Button>
              )}
              
              {notificationList.length > 0 && (
                <Button
                  variant="light"
                  color="red"
                  onClick={deleteAllNotifications}
                  leftSection={<IconTrash size={16} />}
                  size="sm"
                >
                  Delete all
                </Button>
              )}
            </Group>
          </Group>

          {/* Error Alert */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Notifications List */}
          {notificationList.length === 0 ? (
            <Paper
              p="xl"
              radius="md"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                textAlign: 'center',
              }}
            >
              <IconBell size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} style={{ marginBottom: 16 }} />
              <Title order={3} mb="sm" c={isDark ? 'white' : 'dark.9'}>
                No notifications yet
              </Title>
              <Text c="dimmed" maw={400} mx="auto">
                When you receive notifications, they&apos;ll appear here.
              </Text>
            </Paper>
          ) : (
            <Stack gap="md">
              {paginatedNotifications.map((notification) => (
                <Paper
                  key={notification.id}
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: notification.isRead
                      ? (isDark ? theme.colors.dark[6] : 'white')
                      : (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'),
                    borderLeft: `4px solid ${!notification.isRead ? theme.colors.blue[6] : 'transparent'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
                      <Box>
                        {getIcon(notification.type)}
                      </Box>
                      <Box style={{ flex: 1 }}>
                        <Group justify="space-between" wrap="wrap">
                          <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'}>
                            {notification.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </Text>
                        </Group>
                        {notification.content && (
                          <Text size="sm" c="dimmed" mt={4}>
                            {notification.content}
                          </Text>
                        )}
                        {notification.projectId && (
                          <Button
                            component={Link}
                            href={`/projects/${notification.projectId}`}
                            variant="subtle"
                            size="xs"
                            leftSection={<IconEye size={12} />}
                            mt={8}
                          >
                            View Project
                          </Button>
                        )}
                      </Box>
                    </Group>
                    
                    <Group gap={4}>
                      {!notification.isRead && (
                        <ActionIcon
                          variant="subtle"
                          onClick={() => markAsRead(notification.id)}
                          size="sm"
                          color="blue"
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      )}
                      <ActionIcon
                        variant="subtle"
                        onClick={() => deleteNotification(notification.id)}
                        size="sm"
                        color="red"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                withEdges
              />
            </Group>
          )}
        </Stack>
      </Container>

    </Box>
  );
}