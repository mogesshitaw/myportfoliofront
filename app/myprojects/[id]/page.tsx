/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Divider,
  Stack,
  Button,
  Avatar,
  Textarea,
  Paper,
  ThemeIcon,
  ActionIcon,
  Loader,
  Center,
  Box,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  IconCalendar,
  IconUser,
  IconWorld,
  IconEye,
  IconBrandGithub,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconCode,
  IconArrowLeft,
  IconAlertCircle,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import apiClient from '@/lib/api'

interface Project {
  id: string
  title: string
  description: string
  detailedDescription?: string
  technologies: string[]
  domainName?: string
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  status: string
  progress: number
  createdAt: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string
  }
  likes: any[]
  comments: Comment[]
  _count?: {
    likes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    fullName: string
    avatarUrl?: string
  }
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const commentForm = useForm({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) => (value.trim().length < 1 ? 'Comment cannot be empty' : null),
    },
  })

  useEffect(() => {
    setMounted(true)
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await apiClient.get(`/projects/${id}`)
      const data = response.data.data
      setProject(data)
      setLikeCount(data._count?.likes || 0)
      setComments(data.comments || [])
      
      if (user?.id) {
        const userLiked = data.likes?.some((like: any) => like.userId === user.id)
        setIsLiked(userLiked)
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load project',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      await apiClient.post(`/projects/${id}/like`)
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
      
      notifications.show({
        title: isLiked ? 'Unliked' : 'Liked',
        message: isLiked ? 'You unliked this project' : 'You liked this project',
        color: isLiked ? 'gray' : 'red',
      })
    } catch (error) {
      console.error('Failed to like project:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to like project',
        color: 'red',
      })
    }
  }

  const handleComment = async (values: typeof commentForm.values) => {
    if (!user) {
      router.push('/login')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await apiClient.post(`/projects/${id}/comments`, {
        content: values.content
      })
      
      setComments(prev => [response.data.data, ...prev])
      commentForm.reset()
      
      notifications.show({
        title: 'Success',
        message: 'Comment added successfully',
        color: 'green',
      })
    } catch (error) {
      console.error('Failed to add comment:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to add comment',
        color: 'red',
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'on-hold': return 'yellow'
      case 'planning': return 'grape'
      default: return 'gray'
    }
  }

  // SSR and initial mount loading state - NO isDark dependency
  if (!mounted || loading) {
    return (
      <>
        <Navbar />
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: '#f8f9fa'  // Fixed color for SSR
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="blue" />  {/* Fixed color - no isDark */}
              <Text c="dimmed">Loading project...</Text>
            </Stack>
          </Center>
        </Box>
        <Footer />
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <Container size="lg" py="xl">
          <Paper
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              textAlign: 'center',
            }}
          >
            <ThemeIcon size={60} radius="xl" color="gray" variant="light" mx="auto" mb="md">
              <IconAlertCircle size={30} />
            </ThemeIcon>
            <Title order={2} mb="sm" c={isDark ? 'white' : 'dark.9'}>Project Not Found</Title>
            <Text c="dimmed" mb="lg">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </Text>
            <Button component={Link} href="/projects" leftSection={<IconArrowLeft size={16} />}>
              Back to Projects
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Navbar />

      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Back Button */}
          <Button
            component={Link}
            href="/projects"
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            style={{ alignSelf: 'flex-start' }}
            color={isDark ? 'gray.4' : 'dark.6'}
          >
            Back to Projects
          </Button>

          {/* Main Card */}
          <Paper
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Stack gap="lg">
              {/* Title and Status */}
              <Group justify="space-between" align="flex-start" wrap="wrap">
                <div>
                  <Title order={1} size="h1" c={isDark ? 'white' : 'dark.9'}>
                    {project.title}
                  </Title>
                  <Group gap="lg" mt="xs">
                    <Group gap="xs">
                      <IconUser size={16} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                      <Text size="sm" c="dimmed">{project.user.fullName}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                      <Text size="sm" c="dimmed">
                        {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </Text>
                    </Group>
                  </Group>
                </div>
                <Badge size="lg" color={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </Group>

              {/* Technologies */}
              <div>
                <Group gap="xs" mb="xs">
                  <IconCode size={18} color={isDark ? theme.colors.gray[3] : theme.colors.dark[6]} />
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>Technologies</Text>
                </Group>
                <Group gap="xs">
                  {project.technologies.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="light" 
                      size="lg"
                      color="blue"
                    >
                      {tech}
                    </Badge>
                  ))}
                </Group>
              </div>

              {/* Progress */}
              {project.progress > 0 && (
                <div>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} c={isDark ? 'white' : 'dark.9'}>Progress</Text>
                    <Text size="sm" c="dimmed">{project.progress}%</Text>
                  </Group>
                  <div style={{ 
                    width: '100%',
                    height: 8,
                    backgroundColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                    borderRadius: theme.radius.xl,
                    overflow: 'hidden',
                  }}>
                    <div 
                      style={{
                        width: `${project.progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #228be6 0%, #be4bdb 100%)',
                        borderRadius: theme.radius.xl,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <Text fw={600} mb="xs" c={isDark ? 'white' : 'dark.9'}>Description</Text>
                <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                  {project.description}
                </Text>
              </div>

              {/* Detailed Description */}
              {project.detailedDescription && (
                <div>
                  <Text fw={600} mb="xs" c={isDark ? 'white' : 'dark.9'}>Detailed Description</Text>
                  <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                    {project.detailedDescription}
                  </Text>
                </div>
              )}

              {/* Project Links */}
              {(project.domainName || project.liveUrl || project.githubUrl) && (
                <div>
                  <Text fw={600} mb="xs" c={isDark ? 'white' : 'dark.9'}>Project Links</Text>
                  <Group gap="md">
                    {project.domainName && (
                      <Button
                        component="a"
                        href={`https://${project.domainName}`}
                        target="_blank"
                        variant="light"
                        leftSection={<IconWorld size={16} />}
                      >
                        Website
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        component="a"
                        href={project.liveUrl}
                        target="_blank"
                        variant="light"
                        color="green"
                        leftSection={<IconEye size={16} />}
                      >
                        Live Demo
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        component="a"
                        href={project.githubUrl}
                        target="_blank"
                        variant="light"
                        leftSection={<IconBrandGithub size={16} />}
                      >
                        GitHub
                      </Button>
                    )}
                  </Group>
                </div>
              )}

              <Divider 
                style={{
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              />
              {/* Like and Comment Summary */}
              <Group justify="center" gap="xl">
                <Group gap="xs">
                  <ActionIcon
                    variant={isLiked ? 'filled' : 'light'}
                    color="red"
                    size="lg"
                    onClick={handleLike}
                    style={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                  </ActionIcon>
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>
                    {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                  </Text>
                </Group>
                <Group gap="xs">
                  <ActionIcon variant="light" size="lg" color="blue">
                    <IconMessage size={20} />
                  </ActionIcon>
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>
                    {comments.length} Comments
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {/* Comments Section */}
          <Paper
            p="xl"
            radius="md"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Stack gap="lg">
              <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                Comments ({comments.length})
              </Title>

              {/* New Comment Form */}
              {user ? (
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
                  }}
                >
                  <form onSubmit={commentForm.onSubmit(handleComment)}>
                    <Stack gap="md">
                      <Textarea
                        placeholder="Write a comment..."
                        minRows={3}
                        {...commentForm.getInputProps('content')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[4] : 'white',
                            color: isDark ? 'white' : 'black',
                            borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                          },
                        }}
                      />
                      <Group justify="flex-end">
                        <Button
                          type="submit"
                          loading={submittingComment}
                          disabled={!commentForm.values.content.trim()}
                          variant="gradient"
                          gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                        >
                          Post Comment
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </Paper>
              ) : (
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
                    textAlign: 'center',
                  }}
                >
                  <Text c="dimmed" mb="sm">Please sign in to comment</Text>
                  <Button component={Link} href="/login" variant="light">
                    Sign In
                  </Button>
                </Paper>
              )}

              {/* Comments List */}
              <Stack gap="md">
                {comments.map((comment) => (
                  <Paper
                    key={comment.id}
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: theme.shadows.md,
                      },
                    }}
                  >
                    <Group gap="sm" mb="xs">
                      <Avatar
                        src={comment.user.avatarUrl}
                        radius="xl"
                        size="sm"
                        color="blue"
                      >
                        {comment.user.fullName[0]}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                          {comment.user.fullName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </Text>
                      </div>
                    </Group>
                    <Text 
                      size="sm" 
                      c={isDark ? theme.colors.gray[3] : theme.colors.dark[6]}
                      ml={44}
                    >
                      {comment.content}
                    </Text>
                  </Paper>
                ))}

                {comments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <IconMessage 
                      size={48} 
                      color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} 
                      style={{ marginBottom: 16 }}
                    />
                    <Text c="dimmed">No comments yet. Be the first to comment!</Text>
                  </div>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
      
      <Footer />
    </Box>
  )
}