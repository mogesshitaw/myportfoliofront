/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  Badge,
  Button,
  Group,
  Stack,
  Box,
  Loader,
  Center,
  Alert,
  ActionIcon,
  Modal,
  Textarea,
  useMantineTheme,
  useMantineColorScheme,
  Pagination,
  Select,
  Tooltip,
  Divider,
  Avatar,
  Grid,
  Card,
  SimpleGrid,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconMail,
  IconEye,
  IconTrash,
  IconCheck,
  IconX,
  IconRefresh,
  IconAlertCircle,
  IconUser,
  IconCalendar,
  IconMessage,
  IconSend,
  IconInbox,
  IconArchive,
  IconFilter,
  IconDownload,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  service?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  totalMessages: number;
  unreadMessages: number;
  messagesThisMonth: number;
  messagesByService: Array<{ service: string; _count: { service: number } }>;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [replyOpened, { open: openReply, close: closeReply }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/contacts';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const response = await apiClient.get(url);
      if (response.data.success) {
        setMessages(response.data.data);
        setCurrentPage(1);
      }
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/contacts/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    openView();
    
    // Mark as read if not already
    if (!message.isRead) {
      try {
        await apiClient.patch(`/contacts/${message.id}/read`, { isRead: true });
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        ));
        if (stats) {
          setStats({
            ...stats,
            unreadMessages: stats.unreadMessages - 1,
          });
        }
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    
    try {
      await apiClient.delete(`/contacts/${selectedMessage.id}`);
      notifications.show({
        title: 'Success',
        message: 'Message deleted successfully',
        color: 'green',
      });
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
      closeDelete();
      closeView();
      fetchStats();
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to delete message',
        color: 'red',
      });
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setSendingReply(true);
    try {
      await apiClient.post('/contacts/reply', {
        messageId: selectedMessage.id,
        to: selectedMessage.email,
        reply: replyText,
      });
      
      notifications.show({
        title: 'Success',
        message: 'Reply sent successfully',
        color: 'green',
      });
      
      setReplyText('');
      closeReply();
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to send reply',
        color: 'red',
      });
    } finally {
      setSendingReply(false);
    }
  };

  const paginatedMessages = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(messages.length / itemsPerPage);

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <Box style={{ 
//           minHeight: 'calc(100vh - 70px)', 
//           backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa' 
//         }}>
//           <Center style={{ height: 'calc(100vh - 70px)' }}>
//             <Stack align="center" gap="md">
//               <Loader size="lg" color={isDark ? 'white' : 'blue'} />
//               <Text c="dimmed">Loading messages...</Text>
//             </Stack>
//           </Center>
//         </Box>
//         <Footer />
//       </>
//     );
//   }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>

      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={1} size="h2" c={isDark ? 'white' : 'dark.9'}>
                Contact Messages
              </Title>
              <Text c="dimmed" mt={4}>
                Manage and respond to messages from your portfolio
              </Text>
            </div>
            <Button
              onClick={fetchMessages}
              leftSection={<IconRefresh size={16} />}
              variant="light"
            >
              Refresh
            </Button>
          </Group>

          {/* Stats Cards */}
          {stats && (
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Messages</Text>
                    <Title order={3} c={isDark ? 'white' : 'dark.9'}>{stats.totalMessages}</Title>
                  </Box>
                  <IconInbox size={24} color={theme.colors.blue[6]} />
                </Group>
              </Paper>
              
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Unread</Text>
                    <Title order={3} c={isDark ? 'white' : 'dark.9'}>{stats.unreadMessages}</Title>
                  </Box>
                  <IconMail size={24} color={theme.colors.red[6]} />
                </Group>
              </Paper>
              
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>This Month</Text>
                    <Title order={3} c={isDark ? 'white' : 'dark.9'}>{stats.messagesThisMonth}</Title>
                  </Box>
                  <IconCalendar size={24} color={theme.colors.green[6]} />
                </Group>
              </Paper>
              
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Group justify="space-between">
                  <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Services</Text>
                    <Title order={3} c={isDark ? 'white' : 'dark.9'}>{stats.messagesByService?.length || 0}</Title>
                  </Box>
                  <IconArchive size={24} color={theme.colors.grape[6]} />
                </Group>
              </Paper>
            </SimpleGrid>
          )}

          {/* Filter */}
          <Group justify="space-between">
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              data={[
                { value: 'all', label: 'All Messages' },
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
              ]}
              leftSection={<IconFilter size={16} />}
              style={{ width: 200 }}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                dropdown: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                },
                option: {
                  color: isDark ? 'white' : 'black',
                },
              }}
            />
            <Text size="sm" c="dimmed">
              {messages.length} total messages
            </Text>
          </Group>

          {/* Error Alert */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Messages Table */}
          <Paper
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              overflow: 'auto',
            }}
          >
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Name / Email</Table.Th>
                  <Table.Th>Subject</Table.Th>
                  <Table.Th>Service</Table.Th>
                  <Table.Th>Received</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedMessages.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Center py={40}>
                        <Stack align="center" gap="sm">
                          <IconInbox size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} />
                          <Text c="dimmed">No messages found</Text>
                        </Stack>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginatedMessages.map((message) => (
                    <Table.Tr key={message.id}>
                      <Table.Td>
                        {message.isRead ? (
                          <Badge color="green" variant="light">Read</Badge>
                        ) : (
                          <Badge color="red" variant="light">Unread</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size="sm" radius="xl" color="blue">
                            {message.name[0]}
                          </Avatar>
                          <Box>
                            <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                              {message.name}
                            </Text>
                            <Text size="xs" c="dimmed">{message.email}</Text>
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                          {message.subject}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="outline" size="sm">
                          {message.service || 'General'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Group gap={4} justify="flex-end">
                          <Tooltip label="View Message">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => handleViewMessage(message)}
                            >
                              <IconEye size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Reply">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => {
                                setSelectedMessage(message);
                                openReply();
                              }}
                            >
                              <IconSend size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                setSelectedMessage(message);
                                openDelete();
                              }}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Paper>

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

      {/* View Message Modal */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="Message Details"
        size="lg"
        centered
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          header: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          title: {
            color: isDark ? 'white' : 'dark.9',
            fontWeight: 600,
          },
        }}
      >
        {selectedMessage && (
          <Stack gap="md">
            <Group>
              <Avatar size="lg" radius="xl" color="blue">
                {selectedMessage.name[0]}
              </Avatar>
              <Box>
                <Text fw={600} size="lg" c={isDark ? 'white' : 'dark.9'}>
                  {selectedMessage.name}
                </Text>
                <Text size="sm" c="dimmed">{selectedMessage.email}</Text>
              </Box>
            </Group>

            <Divider />

            <Box>
              <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>Subject</Text>
              <Text size="md">{selectedMessage.subject}</Text>
            </Box>

            {selectedMessage.service && (
              <Box>
                <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>Service Interested</Text>
                <Badge size="lg" variant="light">{selectedMessage.service}</Badge>
              </Box>
            )}

            <Box>
              <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>Message</Text>
              <Paper p="md" radius="md" style={{ 
                backgroundColor: isDark ? theme.colors.dark[6] : '#f5f5f5',
                maxHeight: 300,
                overflow: 'auto'
              }}>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </Text>
              </Paper>
            </Box>

            <Divider />

            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </Text>
              <Group gap="sm">
                <Button
                  variant="outline"
                  leftSection={<IconSend size={16} />}
                  onClick={() => {
                    closeView();
                    openReply();
                  }}
                >
                  Reply
                </Button>
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => {
                    closeView();
                    openDelete();
                  }}
                >
                  Delete
                </Button>
              </Group>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        opened={replyOpened}
        onClose={closeReply}
        title="Reply to Message"
        size="lg"
        centered
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          header: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          title: {
            color: isDark ? 'white' : 'dark.9',
            fontWeight: 600,
          },
        }}
      >
        {selectedMessage && (
          <Stack gap="md">
            <Box>
              <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>To:</Text>
              <Text>{selectedMessage.name} &lt;{selectedMessage.email}&gt;</Text>
            </Box>

            <Box>
              <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>Subject:</Text>
              <Text>Re: {selectedMessage.subject}</Text>
            </Box>

            <Box>
              <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>Your Reply:</Text>
              <Textarea
                placeholder="Type your reply here..."
                minRows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                }}
              />
            </Box>

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={closeReply}>
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                loading={sendingReply}
                disabled={!replyText.trim()}
                leftSection={<IconSend size={16} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'grape', deg: 135 }}
              >
                Send Reply
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Message"
        centered
        size="md"
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          header: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          title: {
            color: isDark ? 'white' : 'dark.9',
            fontWeight: 600,
          },
        }}
      >
        {selectedMessage && (
          <Stack gap="lg">
            <Alert icon={<IconAlertCircle size={16} />} title="Are you sure?" color="red" variant="light">
              This action cannot be undone. This will permanently delete the message from
              <Text component="span" fw={600} c="red.6"> {selectedMessage.name}</Text>.
            </Alert>

            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={closeDelete}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDelete}>
                Delete
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

    </Box>
  );
}