/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Card,
  Text,
  Title,
  Badge,
  Button,
  Group,
  Stack,
  Box,
  Progress,
  Avatar,
  Paper,
  Loader,
  Center,
  Anchor,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core"
import { notifications } from "@mantine/notifications"
import {
  IconHeart,
  IconHeartFilled,
  IconWorld,
  IconExternalLink,
  IconBrandGithub,
  IconEye,
  IconAlertCircle,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react"
import apiClient from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

interface Project {
  id: string
  title: string
  description: string
  detailedDescription?: string
  technologies: string[]
  domainName?: string
  liveUrl?: string
  githubUrl?: string
  likes: any[]
  comments: any[]
  status: string
  progress: number
  createdAt: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string | null
  }
  _count?: {
    likes: number
    comments: number
  }
}

export function ProjectDetails({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/projects/${projectId}`)
      setProject(data.data)
    } catch (error: any) {
      console.error("Failed to fetch project:", error)
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to load project",
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  const handleLike = async () => {
    if (!project) return
    try {
      const response = await apiClient.post(`/projects/${projectId}/like`)
      setLiked(response.data.liked)
      setProject(prev => prev ? { 
        ...prev, 
        likes: response.data.liked ? [...prev.likes, {}] : prev.likes.slice(0, -1)
      } : null)
      
      notifications.show({
        title: "Success",
        message: response.data.liked ? "Project liked!" : "Project unliked",
        color: "green",
      })
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to like project",
        color: "red",
      })
    }
  }

  const getLikeCount = () => {
    if (!project) return 0
    if (project._count?.likes !== undefined) {
      return project._count.likes
    }
    if (Array.isArray(project.likes)) {
      return project.likes.length
    }
    return 0
  }

  const getCommentCount = () => {
    if (!project) return 0
    if (project._count?.comments !== undefined) {
      return project._count.comments
    }
    if (Array.isArray(project.comments)) {
      return project.comments.length
    }
    return 0
  }

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  if (loading) {
    return (
      <Center style={{ minHeight: '400px' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={isDark ? 'white' : 'blue'} />
          <Text c="dimmed">Loading project details...</Text>
        </Stack>
      </Center>
    )
  }

  if (!project) {
    return (
      <Paper
        p="xl"
        radius="md"
        withBorder
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          textAlign: 'center',
        }}
      >
        <IconAlertCircle 
          size={48} 
          color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} 
          style={{ marginBottom: '16px' }}
        />
        <Title order={3} mb="sm" c={isDark ? 'white' : 'dark.9'}>
          Project Not Found
        </Title>
        <Text c="dimmed" maw={400} mx="auto">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </Text>
      </Paper>
    )
  }

  const likeCount = getLikeCount()
  const commentCount = getCommentCount()

  return (
    <Box style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Box style={{ flex: 1, minWidth: '250px' }}>
              <Group gap="xs" mb="xs">
                <Avatar
                  src={project.user.avatarUrl}
                  radius="xl"
                  color="blue"
                  size="md"
                >
                  {getUserInitial(project.user.fullName)}
                </Avatar>
                <Box>
                  <Text fw={500} size="sm" c={isDark ? 'white' : 'dark.9'}>
                    {project.user.fullName}
                  </Text>
                  <Group gap={4}>
                    <IconCalendar size={12} color={isDark ? theme.colors.gray[6] : theme.colors.gray[6]} />
                    <Text size="xs" c="dimmed">
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </Text>
                  </Group>
                </Box>
              </Group>
              <Title 
                order={2} 
                size="h1" 
                style={{ wordBreak: 'break-word' }}
                c={isDark ? 'white' : 'dark.9'}
              >
                {project.title}
              </Title>
            </Box>

            <Group gap="sm" wrap="wrap">
              <Button
                variant={liked ? "filled" : "light"}
                color="red"
                onClick={handleLike}
                leftSection={liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
              >
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </Button>
              <Badge 
                size="lg"
                color={project.status === 'active' ? 'green' : 'gray'}
                variant={project.status === 'active' ? 'filled' : 'light'}
              >
                {project.status}
              </Badge>
            </Group>
          </Group>

          {/* Description */}
          <Box>
            <Text fw={600} size="lg" mb="xs" c={isDark ? 'white' : 'dark.9'}>
              Description
            </Text>
            <Text 
              c="dimmed" 
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
              {project.description}
            </Text>
          </Box>

          {/* Detailed Description */}
          {project.detailedDescription && (
            <Box>
              <Text fw={600} size="lg" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                Detailed Description
              </Text>
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                  wordBreak: 'break-word',
                }}
              >
                <Text
                  component="div"
                  size="sm"
                  c={isDark ? theme.colors.gray[3] : theme.colors.dark[6]}
                >
                  {project.detailedDescription}
                </Text>
              </Paper>
            </Box>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Box>
              <Text fw={600} size="lg" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                Technologies
              </Text>
              <Group gap="xs">
                {project.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="light" 
                    color="blue"
                    size="lg"
                    style={{ wordBreak: 'break-word' }}
                  >
                    {tech}
                  </Badge>
                ))}
              </Group>
            </Box>
          )}

          {/* Links */}
          {(project.domainName || project.liveUrl || project.githubUrl) && (
            <Box>
              <Text fw={600} size="lg" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                Project Links
              </Text>
              <Stack gap="xs">
                {project.domainName && (
                  <Group gap="xs" wrap="nowrap" style={{ overflow: 'hidden' }}>
                    <IconWorld size={18} color={theme.colors.blue[6]} style={{ flexShrink: 0 }} />
                    <Anchor
                      href={`https://${project.domainName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      c="blue.6"
                      style={{ wordBreak: 'break-all' }}
                    >
                      {project.domainName}
                    </Anchor>
                    <IconExternalLink size={14} style={{ flexShrink: 0 }} />
                  </Group>
                )}
                {project.liveUrl && (
                  <Group gap="xs" wrap="nowrap" style={{ overflow: 'hidden' }}>
                    <IconEye size={18} color={theme.colors.green[6]} style={{ flexShrink: 0 }} />
                    <Anchor
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      c="green.6"
                      style={{ wordBreak: 'break-all' }}
                    >
                      {project.liveUrl}
                    </Anchor>
                    <IconExternalLink size={14} style={{ flexShrink: 0 }} />
                  </Group>
                )}
                {project.githubUrl && (
                  <Group gap="xs" wrap="nowrap" style={{ overflow: 'hidden' }}>
                    <IconBrandGithub size={18} color={isDark ? 'white' : 'dark.9'} style={{ flexShrink: 0 }} />
                    <Anchor
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      c={isDark ? 'white' : 'dark.9'}
                      style={{ wordBreak: 'break-all' }}
                    >
                      {project.githubUrl}
                    </Anchor>
                    <IconExternalLink size={14} style={{ flexShrink: 0 }} />
                  </Group>
                )}
              </Stack>
            </Box>
          )}

          {/* Progress */}
          {project.progress > 0 && (
            <Box>
              <Group justify="space-between" mb="xs">
                <Text fw={600} size="lg" c={isDark ? 'white' : 'dark.9'}>
                  Progress
                </Text>
                <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                  {project.progress}%
                </Text>
              </Group>
              <Progress 
                value={project.progress} 
                size="lg"
                radius="xl"
                color="blue"
              />
            </Box>
          )}

          {/* Stats */}
          <Group gap="lg">
            <Group gap={4}>
              <IconHeart size={18} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
              <Text size="sm" c="dimmed">{likeCount} likes</Text>
            </Group>
            <Group gap={4}>
              <IconUser size={18} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
              <Text size="sm" c="dimmed">{commentCount} comments</Text>
            </Group>
          </Group>
        </Stack>
      </Card>
    </Box>
  )
}