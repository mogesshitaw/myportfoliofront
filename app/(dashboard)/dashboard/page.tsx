/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Stack,
  Group,
  Progress,
  Badge,
  Box,
  useMantineTheme,
  useMantineColorScheme,
  Loader,
  Center,
  Alert,
  Button,
} from '@mantine/core'
import {
  IconFolder,
  IconFolderOpen,
  IconMessage,
  IconArrowUpRight,
  IconAlertCircle,
  IconRefresh,
  IconUsers,
  IconHeart,
  IconStar,
} from '@tabler/icons-react'
import Link from 'next/link'
import apiClient from '@/lib/api'

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growth: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    featured: number;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
  };
  testimonials: {
    total: number;
    approved: number;
    averageRating: number;
  };
  contacts: {
    total: number;
    unread: number;
    thisMonth: number;
  };
  recentProjects: {
    id: string;
    title: string;
    status: string;
    progress: number;
  }[];
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/dashboard/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.response?.data?.error || 'Failed to load dashboard data')
      // Use mock data for development
      setStats(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const getMockData = (): DashboardStats => ({
    users: {
      total: 1250,
      active: 890,
      newThisMonth: 156,
      growth: 12.5,
    },
    projects: {
      total: 342,
      active: 187,
      completed: 98,
      featured: 12,
    },
    engagement: {
      totalLikes: 2847,
      totalComments: 1234,
    },
    testimonials: {
      total: 48,
      approved: 42,
      averageRating: 4.8,
    },
    contacts: {
      total: 234,
      unread: 12,
      thisMonth: 45,
    },
    recentProjects: [
      { id: '1', title: 'E-commerce Platform', status: 'active', progress: 75 },
      { id: '2', title: 'Mobile App Design', status: 'active', progress: 90 },
      { id: '3', title: 'API Integration', status: 'planning', progress: 25 },
    ],
  })

  const statsCards = [
    { 
      title: 'Total Projects', 
      value: stats?.projects.total || 0, 
      icon: IconFolder, 
      color: 'blue',
      change: stats ? `${stats.projects.active} active` : 'Loading...' 
    },
    { 
      title: 'Active Projects', 
      value: stats?.projects.active || 0, 
      icon: IconFolderOpen, 
      color: 'green',
      change: stats ? `${stats.projects.completed} completed` : 'Loading...' 
    },
    { 
      title: 'Total Users', 
      value: stats?.users.total || 0, 
      icon: IconUsers, 
      color: 'grape',
      change: stats ? `+${stats.users.newThisMonth} this month` : 'Loading...' 
    },
    { 
      title: 'Messages', 
      value: stats?.contacts.unread || 0, 
      icon: IconMessage, 
      color: 'orange',
      change: stats ? `${stats.contacts.unread} unread` : 'Loading...' 
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'in-progress': return 'yellow'
      case 'planning': return 'grape'
      default: return 'gray'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Active'
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'planning': return 'Planning'
      default: return status
    }
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center style={{ minHeight: 400 }}>
          <Stack align="center" gap="md">
            <Loader size="lg" color={isDark ? 'white' : 'blue'} />
            <Text c="dimmed">Loading dashboard...</Text>
          </Stack>
        </Center>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error Loading Data"
          color="red"
          variant="light"
          mb="lg"
        >
          {error}
        </Alert>
        <Group justify="center">
          <Button onClick={fetchDashboardData} leftSection={<IconRefresh size={16} />}>
            Try Again
          </Button>
        </Group>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Welcome Section */}
        <Box>
          <Title 
            order={1} 
            size="h1" 
            c={isDark ? 'white' : 'dark.9'}
          >
            Dashboard
          </Title>
          <Text size="lg" c="dimmed">
            Welcome back, <Text component="span" fw={600} c={isDark ? 'blue.4' : 'blue.6'}>{user?.fullName || 'User'}</Text>! Here&apos;s your overview.
          </Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {statsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Paper
                key={stat.title}
                p="md"
                radius="md"
                withBorder
                style={{
                  backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                  borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    {stat.title}
                  </Text>
                  <Icon 
                    size={20} 
                    color={isDark ? theme.colors[stat.color][5] : theme.colors[stat.color][6]} 
                  />
                </Group>

                <Group justify="space-between" align="flex-end">
                  <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                    {stat.value}
                  </Title>
                  <Group gap={4}>
                    <IconArrowUpRight size={16} color={theme.colors.green[6]} />
                    <Text size="xs" c="dimmed">
                      {stat.change}
                    </Text>
                  </Group>
                </Group>
              </Paper>
            )
          })}
        </SimpleGrid>

        {/* Additional Stats Row */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : 'white',
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Engagement
              </Text>
              <IconHeart size={20} color={theme.colors.red[6]} />
            </Group>
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.engagement.totalLikes.toLocaleString()}
                </Title>
                <Text size="xs" c="dimmed">Total Likes</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.engagement.totalComments.toLocaleString()}
                </Title>
                <Text size="xs" c="dimmed">Comments</Text>
              </div>
            </Group>
          </Paper>

          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : 'white',
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Testimonials
              </Text>
              <IconStar size={20} color={theme.colors.yellow[6]} />
            </Group>
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.testimonials.total}
                </Title>
                <Text size="xs" c="dimmed">Total</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.testimonials.approved}
                </Title>
                <Text size="xs" c="dimmed">Approved</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.testimonials.averageRating}
                </Title>
                <Text size="xs" c="dimmed">Rating</Text>
              </div>
            </Group>
          </Paper>

          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : 'white',
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Group justify="space-between" mb="xs">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Contacts
              </Text>
              <IconMessage size={20} color={theme.colors.grape[6]} />
            </Group>
            <Group justify="space-between" align="flex-end">
              <div>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.contacts.total}
                </Title>
                <Text size="xs" c="dimmed">Total</Text>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  {stats?.contacts.thisMonth}
                </Title>
                <Text size="xs" c="dimmed">This Month</Text>
              </div>
            </Group>
            <Text size="xs" c="dimmed" mt="sm">
              {stats?.contacts.unread} unread messages
            </Text>
          </Paper>
        </SimpleGrid>

        {/* Recent Projects */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[7] : 'white',
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          }}
        >
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3} size="h3" c={isDark ? 'white' : 'dark.9'}>
                Recent Projects
              </Title>
              <Badge 
                variant="light" 
                color="blue"
                size="lg"
              >
                {stats?.recentProjects.length || 0} total
              </Badge>
            </Group>

            <Stack gap="sm">
              {stats?.recentProjects.map((project) => (
                <Paper
                  key={project.id}
                  p="sm"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  }}
                >
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Box>
                        <Text fw={600} c={isDark ? 'white' : 'dark.9'}>
                          {project.title}
                        </Text>
                        <Badge 
                          size="sm" 
                          variant="light" 
                          color={getStatusColor(project.status)}
                          mt={2}
                        >
                          {getStatusLabel(project.status)}
                        </Badge>
                      </Box>
                      <Text size="sm" fw={600} c={isDark ? 'white' : 'dark.9'}>
                        {project.progress}%
                      </Text>
                    </Group>
                    
                    <Progress 
                      value={project.progress} 
                      color={getStatusColor(project.status)}
                      size="md"
                      radius="xl"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {stats?.recentProjects.length === 0 && (
              <Text ta="center" c="dimmed" py="xl">
                No projects yet. Create your first project!
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Quick Actions */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : 'white',
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'} mb="xs">
              Quick Actions
            </Text>
            <Stack gap="xs">
              <Group gap="xs">
                <Badge 
                  component="a" 
                  href="/projects/new" 
                  variant="light" 
                  color="blue"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                >
                  + New Project
                </Badge>
                <Badge 
                  component="a" 
                  href="/messages" 
                  variant="light" 
                  color="green"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                >
                  View Messages
                </Badge>
                <Badge 
                  component="a" 
                  href="/testimonials/new" 
                  variant="light" 
                  color="grape"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                >
                  Add Testimonial
                </Badge>
              </Group>
            </Stack>
          </Paper>

          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : 'white',
              borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            }}
          >
            <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'} mb="xs">
              Account Summary
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Role</Text>
                <Badge size="sm" color={user?.role === 'admin' ? 'grape' : 'blue'}>
                  {user?.role || 'Client'}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Projects Created</Text>
                <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                  {stats?.projects.total || 0}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Total Engagement</Text>
                <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                  {((stats?.engagement.totalLikes || 0) + (stats?.engagement.totalComments || 0)).toLocaleString()}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}