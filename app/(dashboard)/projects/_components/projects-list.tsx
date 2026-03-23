/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Button,
  Avatar,
  ActionIcon,
  Skeleton,
  Paper,
  ThemeIcon,
  Stack,
  Divider,
  Modal,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
  Center,
  Loader,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { 
  IconHeart, 
  IconMessage, 
  IconEye, 
  IconEdit,
  IconTrash,
  IconFolder,
  IconPlus,
  IconAlertCircle,
  IconX,
  IconCheck,
} from '@tabler/icons-react'
import apiClient from '@/lib/api'
import { CreateProjectButton } from './create-project-button'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  likes: any[] 
  comments: any[]
  createdAt: string
  status: string
  featured?: boolean
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

export function ProjectsList() {
  const router = useRouter()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/projects/user/me')
      
      if (response.data?.success && Array.isArray(response.data.data)) {
        setProjects(response.data.data)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load projects',
        color: 'red',
        icon: <IconX size={16} />,
      })
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const getLikeCount = (project: Project) => {
    if (project._count?.likes !== undefined) {
      return project._count.likes
    }
    if (Array.isArray(project.likes)) {
      return project.likes.length
    }
    return 0
  }

  const getCommentCount = (project: Project) => {
    if (project._count?.comments !== undefined) {
      return project._count.comments
    }
    if (Array.isArray(project.comments)) {
      return project.comments.length
    }
    return 0
  }

  const handleEdit = (projectId: string) => {
    router.push(`/projects/${projectId}/edit`)
  }

  const handleDelete = (project: Project) => {
    setSelectedProject(project)
    openDeleteModal()
  }

  const confirmDelete = async () => {
    if (!selectedProject) return
    
    setIsDeleting(true)
    try {
      await apiClient.delete(`/projects/${selectedProject.id}`)
      
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      })
      
      setProjects(projects.filter(p => p.id !== selectedProject.id))
      closeDeleteModal()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to delete project',
        color: 'red',
        icon: <IconX size={16} />,
      })
    } finally {
      setIsDeleting(false)
      setSelectedProject(null)
    }
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {[1, 2, 3].map(i => (
            <Card key={i} shadow="md" p="lg" radius="md" withBorder>
              <Skeleton height={24} width="70%" mb="md" />
              <Skeleton height={16} width="40%" mb="sm" />
              <Skeleton height={16} width="90%" mb="xs" />
              <Skeleton height={16} width="80%" mb="lg" />
              <Group mt="md">
                <Skeleton height={24} width={60} />
                <Skeleton height={24} width={60} />
                <Skeleton height={24} width={60} />
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Paper p="xl" radius="lg" withBorder>
          <ThemeIcon size={60} radius={60} variant="light" color="blue" mx="auto" mb={4}>
            <IconFolder size={30} />
          </ThemeIcon>
          <Title order={3} ta="center" mb="sm">No projects yet</Title>
          <Text c="dimmed" ta="center" mb="lg">
            Create your first project to get started
          </Text>
          <Group justify="center">
                     <CreateProjectButton />
           
          </Group>
        </Paper>
      </Container>
    )
  }

  return (
    <>
      <Container size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {projects.map((project) => {
            const userName = project.user?.fullName || 'Unknown User'
            const userInitial = userName.charAt(0).toUpperCase()
            const likeCount = getLikeCount(project)
            const commentCount = getCommentCount(project)
            
            return (
              <Card
                key={project.id}
                shadow="md"
                p="lg"
                radius="lg"
                withBorder
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
                className="hover:shadow-xl hover:-translate-y-1"
              >
                <Card.Section 
                  p="lg" 
                  style={{ 
                    borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Title order={3} size="h4" lineClamp={1} c={isDark ? 'white' : 'dark.9'}>
                      {project.title}
                    </Title>
                    <Badge 
                      color={project.status === 'active' ? 'green' : 'gray'}
                      variant="filled"
                    >
                      {project.status}
                    </Badge>
                  </Group>
                  
                  <Group gap="xs" mt="sm">
                    <Avatar 
                      size="sm" 
                      radius="xl" 
                      color="blue"
                      src={project.user?.avatarUrl}
                    >
                      {userInitial}
                    </Avatar>
                    <Text size="sm" c="dimmed">{userName}</Text>
                  </Group>
                </Card.Section>

                <div style={{ flex: 1, padding: '16px' }}>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {project.description}
                  </Text>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <Group gap="xs" mt="md">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="light" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="light" size="sm">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </Group>
                  )}
                </div>

                <Divider style={{ borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2] }} />

                <div style={{ padding: '16px' }}>
                  <Group justify="space-between">
                    <Group gap="md">
                      <Group gap={4}>
                        <IconHeart size={16} color={isDark ? theme.colors.gray[4] : theme.colors.gray[6]} />
                        <Text size="sm" c="dimmed">{likeCount}</Text>
                      </Group>
                      <Group gap={4}>
                        <IconMessage size={16} color={isDark ? theme.colors.gray[4] : theme.colors.gray[6]} />
                        <Text size="sm" c="dimmed">{commentCount}</Text>
                      </Group>
                    </Group>
                    
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        onClick={() => handleEdit(project.id)}
                        size="md"
                        color={isDark ? 'gray.4' : 'dark.6'}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                      
                      <ActionIcon
                        variant="subtle"
                        onClick={() => handleDelete(project)}
                        size="md"
                        color="red"
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                      
                      <Button
                        component={Link}
                        href={`/projects/${project.id}`}
                        variant="light"
                        size="xs"
                        leftSection={<IconEye size={14} />}
                      >
                        View
                      </Button>
                    </Group>
                  </Group>
                </div>
              </Card>
            )
          })}
        </SimpleGrid>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Group gap="xs">
            <IconAlertCircle size={20} style={{ color: theme.colors.red[6] }} />
            <Title order={4}>Delete Project</Title>
          </Group>
        }
        size="md"
        radius="lg"
        centered
      >
        <Stack gap="lg">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Warning"
            color="red"
            variant="light"
          >
            This action cannot be undone. This will permanently delete the project
            {selectedProject && (
              <Text component="span" fw={600}> {selectedProject.title} </Text>
            )}
            and all its associated data.
          </Alert>

          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeDeleteModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={isDeleting}
              leftSection={!isDeleting && <IconTrash size={16} />}
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}