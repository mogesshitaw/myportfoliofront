/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Grid,
  Group,
  Stack,
  Box,
  Loader,
  Center,
  Alert,
  Select,
  Card,
  SimpleGrid,
  ThemeIcon,
  Progress,
  Divider,
  Badge,
  useMantineTheme,
  useMantineColorScheme,
  Button,
} from '@mantine/core';
import {
  IconUsers,
  IconFolder,
  IconMessage,
  IconHeart,
  IconChartBar,
  IconCalendar,
  IconTrendingUp,
  IconTrendingDown,
  IconRefresh,
  IconCode,
  IconStar,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
    byRole: { role: string; count: number }[];
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    featured: number;
    byStatus: { status: string; count: number }[];
    byTechnology: { technology: string; count: number }[];
    monthlyCreation: { month: string; count: number }[];
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
    averageLikesPerProject: number;
    averageCommentsPerProject: number;
  };
  testimonials: {
    total: number;
    approved: number;
    pending: number;
    averageRating: number;
  };
  contacts: {
    total: number;
    unread: number;
    thisMonth: number;
    byService: { service: string; count: number }[];
  };
  topProjects: {
    id: string;
    title: string;
    likes: number;
    comments: number;
  }[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<string>('30days');
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/analytics';
      const params = new URLSearchParams();
      params.append('timeframe', timeframe);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics');
      // Set mock data for development
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): AnalyticsData => ({
    users: {
      total: 1250,
      active: 890,
      newThisMonth: 156,
      growth: 12.5,
      byRole: [
        { role: 'Admin', count: 3 },
        { role: 'Client', count: 987 },
        { role: 'Developer', count: 260 },
      ],
    },
    projects: {
      total: 342,
      active: 187,
      completed: 98,
      featured: 12,
      byStatus: [
        { status: 'Active', count: 187 },
        { status: 'In Progress', count: 45 },
        { status: 'Completed', count: 98 },
        { status: 'Planning', count: 12 },
      ],
      byTechnology: [
        { technology: 'React', count: 156 },
        { technology: 'Next.js', count: 98 },
        { technology: 'Node.js', count: 87 },
        { technology: 'TypeScript', count: 123 },
        { technology: 'MongoDB', count: 67 },
      ],
      monthlyCreation: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 18 },
        { month: 'Mar', count: 24 },
        { month: 'Apr', count: 28 },
        { month: 'May', count: 32 },
        { month: 'Jun', count: 35 },
      ],
    },
    engagement: {
      totalLikes: 2847,
      totalComments: 1234,
      averageLikesPerProject: 8.3,
      averageCommentsPerProject: 3.6,
    },
    testimonials: {
      total: 48,
      approved: 42,
      pending: 6,
      averageRating: 4.8,
    },
    contacts: {
      total: 234,
      unread: 12,
      thisMonth: 45,
      byService: [
        { service: 'Web Development', count: 98 },
        { service: 'Mobile Development', count: 45 },
        { service: 'UI/UX Design', count: 32 },
        { service: 'Consulting', count: 23 },
      ],
    },
    topProjects: [
      { id: '1', title: 'E-commerce Platform', likes: 342, comments: 89 },
      { id: '2', title: 'Task Management App', likes: 287, comments: 67 },
      { id: '3', title: 'AI Image Generator', likes: 234, comments: 56 },
      { id: '4', title: 'Portfolio Website', likes: 198, comments: 43 },
      { id: '5', title: 'Blog Platform', likes: 167, comments: 38 },
    ],
  });

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
              <Text c="dimmed">Loading analytics...</Text>
            </Stack>
          </Center>
        </Box>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Container size="lg" py={80}>
          <Alert icon={<IconChartBar size={16} />} title="Error" color="red">
            {error || 'Failed to load analytics data'}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>

      <Container size="xl" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" wrap="wrap">
            <div>
              <Title order={1} size="h2" c={isDark ? 'white' : 'dark.9'}>
                Analytics Dashboard
              </Title>
              <Text c="dimmed" mt={4}>
                Track your portfolio performance and engagement metrics
              </Text>
            </div>
            <Group gap="sm">
              <Select
                placeholder="Timeframe"
                value={timeframe}
                onChange={(value) => setTimeframe(value || '30days')}
                data={[
                  { value: '7days', label: 'Last 7 days' },
                  { value: '30days', label: 'Last 30 days' },
                  { value: '90days', label: 'Last 90 days' },
                  { value: 'year', label: 'This year' },
                ]}
                style={{ width: 150 }}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                }}
              />
              <Button
                variant="light"
                onClick={fetchAnalytics}
                leftSection={<IconRefresh size={16} />}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          {/* Overview Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <Card p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Users</Text>
                  <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>{data.users.total.toLocaleString()}</Title>
                  <Group gap={4} mt={4}>
                    <IconTrendingUp size={14} color="green" />
                    <Text size="xs" c="green">+{data.users.growth}%</Text>
                    <Text size="xs" c="dimmed">vs last month</Text>
                  </Group>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconUsers size={20} />
                </ThemeIcon>
              </Group>
            </Card>

            <Card p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Projects</Text>
                  <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>{data.projects.total}</Title>
                  <Text size="xs" c="dimmed">{data.projects.active} active</Text>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                  <IconFolder size={20} />
                </ThemeIcon>
              </Group>
            </Card>

            <Card p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Likes</Text>
                  <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>{data.engagement.totalLikes.toLocaleString()}</Title>
                  <Text size="xs" c="dimmed">~{data.engagement.averageLikesPerProject} per project</Text>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="red">
                  <IconHeart size={20} />
                </ThemeIcon>
              </Group>
            </Card>

            <Card p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Contact Messages</Text>
                  <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>{data.contacts.total}</Title>
                  <Text size="xs" c="dimmed">{data.contacts.unread} unread</Text>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="grape">
                  <IconMessage size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </SimpleGrid>

          {/* Projects by Status */}
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
            <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
              Projects by Status
            </Title>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              {data.projects.byStatus.map((status, index) => {
                const total = data.projects.total;
                const percentage = total > 0 ? (status.count / total) * 100 : 0;
                return (
                  <Box key={status.status}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c={isDark ? 'white' : 'dark.9'}>{status.status}</Text>
                      <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>{status.count}</Text>
                    </Group>
                    <Progress value={percentage} size="md" color={COLORS[index % COLORS.length]} />
                    <Text size="xs" c="dimmed" mt={2}>{percentage.toFixed(1)}%</Text>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Paper>

          {/* Technologies */}
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
            <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
              Top Technologies
            </Title>
            <Stack gap="sm">
              {data.projects.byTechnology.slice(0, 5).map((tech, index) => {
                const maxCount = Math.max(...data.projects.byTechnology.map(t => t.count));
                const percentage = (tech.count / maxCount) * 100;
                return (
                  <Box key={tech.technology}>
                    <Group justify="space-between" mb={4}>
                      <Group gap="xs">
                        <IconCode size={16} color={COLORS[index % COLORS.length]} />
                        <Text size="sm" c={isDark ? 'white' : 'dark.9'}>{tech.technology}</Text>
                      </Group>
                      <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>{tech.count}</Text>
                    </Group>
                    <Progress value={percentage} size="sm" color={COLORS[index % COLORS.length]} />
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          {/* Engagement Stats */}
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
                  Engagement Overview
                </Title>
                <Stack gap="md">
                  <Box>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Average Likes per Project</Text>
                      <Text size="lg" fw={700} c="blue.6">{data.engagement.averageLikesPerProject}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between" mt="md" mb={4}>
                      <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Average Comments per Project</Text>
                      <Text size="lg" fw={700} c="green.6">{data.engagement.averageCommentsPerProject}</Text>
                    </Group>
                  </Box>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
                  Testimonials
                </Title>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Total</Text>
                    <Text fw={600} c={isDark ? 'white' : 'dark.9'}>{data.testimonials.total}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Approved</Text>
                    <Text fw={600} c="green.6">{data.testimonials.approved}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Pending</Text>
                    <Text fw={600} c="yellow.6">{data.testimonials.pending}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c={isDark ? 'white' : 'dark.9'}>Average Rating</Text>
                    <Group gap={4}>
                      <IconStar size={16} color="gold" />
                      <Text fw={600} c={isDark ? 'white' : 'dark.9'}>{data.testimonials.averageRating}</Text>
                      <Text size="xs" c="dimmed">/5</Text>
                    </Group>
                  </Group>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Contact Messages by Service */}
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
            <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
              Contact Messages by Service
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {data.contacts.byService.map((service, index) => {
                const total = data.contacts.total;
                const percentage = total > 0 ? (service.count / total) * 100 : 0;
                return (
                  <Box key={service.service}>
                    <Group justify="space-between" mb={4}>
                      <Text size="sm" c={isDark ? 'white' : 'dark.9'}>{service.service}</Text>
                      <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>{service.count}</Text>
                    </Group>
                    <Progress value={percentage} size="sm" color={COLORS[index % COLORS.length]} />
                    <Text size="xs" c="dimmed" mt={2}>{percentage.toFixed(1)}%</Text>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Paper>

          {/* Top Projects */}
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
            <Title order={3} size="h4" mb="md" c={isDark ? 'white' : 'dark.9'}>
              Top Performing Projects
            </Title>
            <Stack gap="sm">
              {data.topProjects.map((project, index) => (
                <Box key={project.id}>
                  <Group justify="space-between" wrap="wrap">
                    <Group gap="md">
                      <Text size="lg" fw={700} c={isDark ? 'white' : 'dark.9'}>#{index + 1}</Text>
                      <Box>
                        <Text fw={500} c={isDark ? 'white' : 'dark.9'}>{project.title}</Text>
                        <Group gap="sm" mt={2}>
                          <Group gap={4}>
                            <IconHeart size={14} color="#ef4444" />
                            <Text size="xs" c="dimmed">{project.likes} likes</Text>
                          </Group>
                          <Group gap={4}>
                            <IconMessage size={14} color="#3b82f6" />
                            <Text size="xs" c="dimmed">{project.comments} comments</Text>
                          </Group>
                        </Group>
                      </Box>
                    </Group>
                    <Progress
                      value={(project.likes / data.topProjects[0].likes) * 100}
                      size="sm"
                      w={150}
                      color="blue"
                    />
                  </Group>
                  {index < data.topProjects.length - 1 && <Divider my="sm" />}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>

    </Box>
  );
}