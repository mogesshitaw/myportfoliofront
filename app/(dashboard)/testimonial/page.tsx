/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Table,
  Badge,
  Button,
  Group,
  Stack,
  Paper,
  Avatar,
  ActionIcon,
  Modal,
  Textarea,
  Rating,
  Select,
  Pagination,
  Loader,
  Center,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
  Box,
  Tooltip,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconEye,
  IconCheck,
  IconX,
  IconStar,
  IconTrash,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconMessage,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Testimonial {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/testimonials/admin/all';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await apiClient.get(url);
      if (response.data.success) {
        setTestimonials(response.data.data);
        setCurrentPage(1);
      }
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.response?.data?.error || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await apiClient.patch(`/testimonials/${id}/approve`);
      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: 'Testimonial approved successfully',
          color: 'green',
        });
        fetchTestimonials();
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to approve testimonial',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      const response = await apiClient.patch(`/testimonials/${id}/reject`);
      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: 'Testimonial rejected',
          color: 'orange',
        });
        fetchTestimonials();
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to reject testimonial',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    setActionLoading(true);
    try {
      const response = await apiClient.patch(`/testimonials/${id}/feature`);
      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: currentFeatured ? 'Removed from featured' : 'Added to featured',
          color: 'green',
        });
        fetchTestimonials();
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to update featured status',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    setActionLoading(true);
    try {
      const response = await apiClient.delete(`/testimonials/${id}`);
      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: 'Testimonial deleted successfully',
          color: 'green',
        });
        fetchTestimonials();
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to delete testimonial',
        color: 'red',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge color="green">Approved</Badge>;
      case 'pending':
        return <Badge color="yellow">Pending</Badge>;
      case 'rejected':
        return <Badge color="red">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  if (loading) {
    return (
      <>
        <Box style={{ minHeight: '100vh', backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa' }}>
          <Container size="xl" py="xl">
            <Center style={{ minHeight: 400 }}>
              <Stack align="center" gap="md">
                <Loader size="lg" color={isDark ? 'white' : 'blue'} />
                <Text c="dimmed">Loading testimonials...</Text>
              </Stack>
            </Center>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <Box style={{ backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa', minHeight: '100vh' }}>

      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={1} size="h2" c={isDark ? 'white' : 'dark.9'}>
                Testimonial Management
              </Title>
              <Text c="dimmed" mt={4}>
                Manage client testimonials - approve, reject, feature, and delete
              </Text>
            </div>
            <Button
              onClick={fetchTestimonials}
              leftSection={<IconRefresh size={16} />}
              variant="light"
              loading={loading}
            >
              Refresh
            </Button>
          </Group>

          {/* Filter Tabs */}
          <Group gap="sm">
            <Button
              variant={filter === 'all' ? 'filled' : 'light'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({testimonials.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'filled' : 'light'}
              onClick={() => setFilter('pending')}
              size="sm"
              color="yellow"
            >
              Pending ({testimonials.filter(t => t.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'approved' ? 'filled' : 'light'}
              onClick={() => setFilter('approved')}
              size="sm"
              color="green"
            >
              Approved ({testimonials.filter(t => t.status === 'approved').length})
            </Button>
            <Button
              variant={filter === 'rejected' ? 'filled' : 'light'}
              onClick={() => setFilter('rejected')}
              size="sm"
              color="red"
            >
              Rejected ({testimonials.filter(t => t.status === 'rejected').length})
            </Button>
          </Group>

          {/* Error Alert */}
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              {error}
            </Alert>
          )}

          {/* Testimonials Table */}
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
                  <Table.Th>Avatar</Table.Th>
                  <Table.Th>Author</Table.Th>
                  <Table.Th>Position</Table.Th>
                  <Table.Th>Rating</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Featured</Table.Th>
                  <Table.Th>Submitted</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedTestimonials.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Center py={40}>
                        <Text c="dimmed">No testimonials found</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginatedTestimonials.map((t) => (
                    <Table.Tr key={t.id}>
                      <Table.Td>
                        <Avatar src={t.avatarUrl} radius="xl" size="md" color="blue">
                          {t.author[0]}
                        </Avatar>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500} c={isDark ? 'white' : 'dark.9'}>
                          {t.author}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {t.position}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Rating value={t.rating} readOnly size="sm" />
                      </Table.Td>
                      <Table.Td>{getStatusBadge(t.status)}</Table.Td>
                      <Table.Td>
                        {t.featured ? (
                          <Badge color="blue" variant="light">Featured</Badge>
                        ) : (
                          <Text size="xs" c="dimmed">No</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Tooltip label="View">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setSelectedTestimonial(t);
                                openView();
                              }}
                            >
                              <IconEye size={18} />
                            </ActionIcon>
                          </Tooltip>

                          {t.status === 'pending' && (
                            <>
                              <Tooltip label="Approve">
                                <ActionIcon
                                  variant="subtle"
                                  color="green"
                                  onClick={() => handleApprove(t.id)}
                                  disabled={actionLoading}
                                >
                                  <IconCheck size={18} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  onClick={() => handleReject(t.id)}
                                  disabled={actionLoading}
                                >
                                  <IconX size={18} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}

                          {t.status === 'approved' && (
                            <Tooltip label={t.featured ? 'Remove from featured' : 'Feature on homepage'}>
                              <ActionIcon
                                variant="subtle"
                                color="yellow"
                                onClick={() => handleToggleFeatured(t.id, t.featured)}
                                disabled={actionLoading}
                              >
                                <IconStar size={18} />
                              </ActionIcon>
                            </Tooltip>
                          )}

                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => handleDelete(t.id)}
                              disabled={actionLoading}
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

      {/* View Testimonial Modal */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="Testimonial Details"
        size="md"
        centered
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          title: {
            color: isDark ? 'white' : 'dark.9',
            fontWeight: 600,
          },
        }}
      >
        {selectedTestimonial && (
          <Stack gap="md">
            <Group>
              <Avatar src={selectedTestimonial.avatarUrl} size="lg" radius="xl">
                {selectedTestimonial.author[0]}
              </Avatar>
              <Box>
                <Text fw={600} size="lg" c={isDark ? 'white' : 'dark.9'}>
                  {selectedTestimonial.author}
                </Text>
                <Text size="sm" c="dimmed">{selectedTestimonial.position}</Text>
              </Box>
            </Group>
            <Rating value={selectedTestimonial.rating} readOnly />
            <Paper p="md" radius="md" style={{ backgroundColor: isDark ? theme.colors.dark[7] : '#f5f5f5' }}>
              <Text size="sm" style={{ fontStyle: 'italic' }}>
                &quot;{selectedTestimonial.content}&quot;
              </Text>
            </Paper>
            <Group justify="space-between">
              <Badge size="lg" color={selectedTestimonial.status === 'approved' ? 'green' : 'yellow'}>
                {selectedTestimonial.status.toUpperCase()}
              </Badge>
              {selectedTestimonial.featured && (
                <Badge size="lg" color="blue">Featured on Homepage</Badge>
              )}
            </Group>
            <Divider />
            <Text size="xs" c="dimmed">
              Submitted: {new Date(selectedTestimonial.createdAt).toLocaleString()}
            </Text>
            {selectedTestimonial.approvedAt && (
              <Text size="xs" c="dimmed">
                Approved: {new Date(selectedTestimonial.approvedAt).toLocaleString()}
              </Text>
            )}
          </Stack>
        )}
      </Modal>
    </Box>
  );
}