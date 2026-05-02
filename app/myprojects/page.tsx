/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Container,
  Title,
  Text,
  Paper,
  Card,
  Group,
  Stack,
  Badge,
  Avatar,
  Button,
  TextInput,
  Select,
  Progress,
  SimpleGrid,
  ThemeIcon,
  ActionIcon,
  Loader,
  Center,
  Box,
  Pagination,
  Modal,
  useMantineTheme,
  useMantineColorScheme,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconArrowRight,
  IconStar,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconCode,
  IconBrandGithub,
  IconSearch,
  IconFilter,
  IconX,
  IconClock,
  IconLayoutGrid,
  IconList,
  IconCalendar,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import apiClient from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

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
  updatedAt?: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string | null
  }
  _count: {
    likes: number
    comments: number
  }
   isLiked?: boolean  
}


export default function PublicProjectsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] =useState<Project[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [techStack, setTechStack] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [filterOpened, { open, close }] = useDisclosure(false)
  const [mounted, setMounted] = useState(false)

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024
  const itemsPerPage = isMobile ? 6 : isTablet ? 8 : 9

  useEffect(() => {
       const token = localStorage.getItem('accessToken');
    setMounted(true)
     fetchFeaturedProjects()

if(token){
      fetchProjects()
    }
else{
  fetchProjectswitouttoken()}
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      const techs = new Set<string>()
      projects.forEach(project => {
        project.technologies.forEach(tech => techs.add(tech))
      })
      setTechStack(Array.from(techs).sort())
    }
  }, [projects])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchQuery, selectedTech, selectedStatus, sortBy])

    const fetchProjectswitouttoken= async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await apiClient.get('/projects/notoken')
      setProjects(data.data)
      setApiAvailable(true)
    } catch (error: any) {
      console.error('Failed to fetch projects:', error)
      
      if (error.response?.status === 404) {
        setApiAvailable(false)
        setError('API endpoint not found. Please check if the backend server is running.')
      } else {
        setError(error.response?.data?.error || 'Failed to fetch projects')
      }
    } finally {
      setLoading(false)
    }
  }

 const fetchProjects = async () => {

  try {
    setLoading(true)
    setError(null)
    const { data } = await apiClient.get('/projects')
    
    setProjects(data.data)
    
   const likedSet = new Set(
  data.data
    .filter((project: Project) => project.isLiked === true)
    .map((project: Project) => project.id)
) as Set<string>;  // ✅ Type assertion ጨምር

setLikedProjects(likedSet);

    setApiAvailable(true)
  } catch (error: any) {
    console.error('Failed to fetch projects:', error)
    if (error.response?.status === 404) {
      setApiAvailable(false)
      setError('API endpoint not found. Please check if the backend server is running.')
    } else {
      setError(error.response?.data?.error || 'Failed to fetch projects')
    }
  } finally {
    setLoading(false)
  }
}
  const fetchFeaturedProjects = async () => {
    try {
      const { data } = await apiClient.get('/projects/featured')
      setFeaturedProjects(data.data || [])
    } catch (error) {
      console.error('Failed to fetch featured projects:', error)
      setFeaturedProjects([])
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.user.fullName.toLowerCase().includes(query)
      )
    }

    if (selectedTech) {
      filtered = filtered.filter(project => 
        project.technologies.includes(selectedTech)
      )
    }

    if (selectedStatus) {
      filtered = filtered.filter(project => 
        project.status === selectedStatus
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'mostLiked':
          return (b._count?.likes || 0) - (a._count?.likes || 0)
        case 'mostCommented':
          return (b._count?.comments || 0) - (a._count?.comments || 0)
        case 'progress':
          return b.progress - a.progress
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
    setCurrentPage(1)
  }

const handleLike = async (projectId: string) => {
  if (!user) {
    router.push('/login?callbackUrl=/projects')
    return
  }

  // ✅ የአሁኑን ሁኔታ በትክክል አግኝ
  const isCurrentlyLiked = likedProjects.has(projectId)
  
  // ✅ Optimistic update - UI ን በፍጥነት አዘምን
  setLikedProjects(prev => {
    const newSet = new Set(prev)
    if (newSet.has(projectId)) {
      newSet.delete(projectId)
    } else {
      newSet.add(projectId)
    }
    return newSet
  })
  
  setProjects(prev => prev.map(project => {
    if (project.id === projectId) {
      const currentLikes = project._count?.likes || 0
      return {
        ...project,
        _count: {
          ...project._count,
          likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1
        },
        isLiked: !isCurrentlyLiked  // ✅ isLiked ን አዘምን
      }
    }
    return project
  }))

  try {
    await apiClient.post(`/projects/${projectId}/like`)
  } catch (error) {
    console.error('Failed to like project:', error)
    
    // ✅ ስህተት ከተፈጠረ ወደ ኋላ ተመለስ (rollback)
    setLikedProjects(prev => {
      const newSet = new Set(prev)
      if (isCurrentlyLiked) {
        newSet.add(projectId)
      } else {
        newSet.delete(projectId)
      }
      return newSet
    })
    
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          _count: {
            ...project._count,
            likes: (project._count?.likes || 0) + (isCurrentlyLiked ? 1 : -1)
          },
          isLiked: isCurrentlyLiked
        }
      }
      return project
    }))
    
    notifications.show({
      title: 'Error',
      message: 'Failed to like project',
      color: 'red',
    })
  }
}

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTech(null)
    setSelectedStatus(null)
    setSortBy('newest')
    close()
  }

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredProjects.slice(start, end)
  }, [filteredProjects, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'on-hold': return 'yellow'
      case 'planning': return 'grape'
      default: return 'gray'
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // SSR and initial mount loading state
  if (!mounted || loading) {
    return (
      <>
        <Navbar />
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: '#f8f9fa'
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="blue" />
              <Text c="dimmed">Loading projects...</Text>
            </Stack>
          </Center>
        </Box>
      </>
    )
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #228be6 0%, #be4bdb 100%)',
          padding: '80px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="md">
            <Title order={1} size="3rem" c="white" ta="center">
              Explore Projects
            </Title>
              <Badge variant="filled" size="lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Group gap={4}>
                <span>My Projects</span>
              </Group>
            </Badge>
            <Text size="lg" c="white" ta="center" opacity={0.9} maw={600}>
              Discover amazing projects from the community
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Featured Projects Section */}
        
       {featuredProjects.length > 0 && (
            <Box mb="xl">
              <Group justify="space-between" mb="lg">
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  ⭐ Featured Projects
                </Title>
                <Button
                  variant="subtle"
                  rightSection={<IconArrowRight size={16} />}
                  onClick={() => router.push('/myprojects')}
                >
                  View All
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                {featuredProjects.slice(0, 3).map((project) => (
                  <Card
                    key={project.id}
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}
                  >
                    <Card.Section>
                      <Box
                        h={160}
                        style={{
                          background: project.imageUrl ? `url(${project.imageUrl})` : 'linear-gradient(135deg, #228be6 0%, #be4bdb 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      />
                    </Card.Section>
                    <Group justify="space-between" mt="md" mb="xs">
                      <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>{project.title}</Title>
                      <Badge color="yellow" variant="light">⭐ Featured</Badge>
                    </Group>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {project.description}
                    </Text>
                    <Button
                      component={Link}
                      href={`/myprojects/${project.id}`}
                      variant="light"
                      fullWidth
                      mt="md"
                    >
                      View Details
                    </Button>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )} 

          {/* Stats Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Projects</Text>
                  <Title order={3} c={isDark ? 'white' : 'dark.9'}>{projects.length}</Title>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconCode size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Technologies</Text>
                  <Title order={3} c={isDark ? 'white' : 'dark.9'}>{techStack.length}</Title>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="green">
                  <IconChartBar size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Active Projects</Text>
                  <Title order={3} c={isDark ? 'white' : 'dark.9'}>{projects.filter(p => p.status === 'active').length}</Title>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="yellow">
                  <IconStar size={20} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Contributors</Text>
                  <Title order={3} c={isDark ? 'white' : 'dark.9'}>{new Set(projects.map(p => p.user.id)).size}</Title>
                </Box>
                <ThemeIcon size="lg" radius="md" variant="light" color="grape">
                  <IconUsers size={20} />
                </ThemeIcon>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Search and Filter Bar */}
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
            <Group justify="space-between" wrap="wrap" gap="md">
              <TextInput
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftSection={<IconSearch size={16} />}
                rightSection={searchQuery && (
                  <ActionIcon onClick={() => setSearchQuery('')} variant="subtle">
                    <IconX size={16} />
                  </ActionIcon>
                )}
                style={{ flex: 1, minWidth: 200 }}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                    color: isDark ? 'white' : 'black',
                  }
                }}
              />

              <Group gap="xs" wrap="wrap">
                {!isMobile && (
                  <>
                    <Select
                      placeholder="Technology"
                      data={techStack}
                      value={selectedTech}
                      onChange={setSelectedTech}
                      leftSection={<IconCode size={16} />}
                      clearable
                      style={{ width: 140 }}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                        },
                        dropdown: {
                          backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                        },
                        option: {
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                          },
                        },
                      }}
                    />
                    
                    <Select
                      placeholder="Status"
                      data={[
                        { value: 'active', label: 'Active' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'on-hold', label: 'On Hold' },
                        { value: 'planning', label: 'Planning' },
                      ]}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      leftSection={<IconClock size={16} />}
                      clearable
                      style={{ width: 140 }}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                        },
                        dropdown: {
                          backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                        },
                        option: {
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                          },
                        },
                      }}
                    />
                    
                    <Select
                      placeholder="Sort by"
                      data={[
                        { value: 'newest', label: 'Newest' },
                        { value: 'oldest', label: 'Oldest' },
                        { value: 'mostLiked', label: 'Most Liked' },
                        { value: 'mostCommented', label: 'Most Commented' },
                        { value: 'progress', label: 'Progress' },
                      ]}
                      value={sortBy}
                      onChange={(value) => setSortBy(value || 'newest')}
                      leftSection={<IconChartBar size={16} />}
                      style={{ width: 140 }}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                        },
                        dropdown: {
                          backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                        },
                        option: {
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                          },
                        },
                      }}
                    />
                  </>
                )}

                <Button 
                  variant="light" 
                  onClick={isMobile ? open : clearFilters}
                  leftSection={isMobile ? <IconFilter size={16} /> : <IconX size={16} />}
                >
                  {isMobile ? 'Filters' : 'Clear'}
                </Button>

                <Tooltip label="Grid view">
                  <ActionIcon
                    variant={viewMode === 'grid' ? 'filled' : 'light'}
                    onClick={() => setViewMode('grid')}
                    size="lg"
                  >
                    <IconLayoutGrid size={18} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="List view">
                  <ActionIcon
                    variant={viewMode === 'list' ? 'filled' : 'light'}
                    onClick={() => setViewMode('list')}
                    size="lg"
                  >
                    <IconList size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Paper>

          {/* Active Filters */}
          {(searchQuery || selectedTech || selectedStatus) && (
            <Group gap="xs">
              <Text size="sm" c="dimmed">Active filters:</Text>
              {searchQuery && (
                <Badge
                  variant="light"
                  rightSection={
                    <ActionIcon size="xs" onClick={() => setSearchQuery('')}>
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  Search: {searchQuery}
                </Badge>
              )}
              {selectedTech && (
                <Badge
                  variant="light"
                  rightSection={
                    <ActionIcon size="xs" onClick={() => setSelectedTech(null)}>
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  Tech: {selectedTech}
                </Badge>
              )}
              {selectedStatus && (
                <Badge
                  variant="light"
                  rightSection={
                    <ActionIcon size="xs" onClick={() => setSelectedStatus(null)}>
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  Status: {selectedStatus}
                </Badge>
              )}
            </Group>
          )}

          {/* Results count */}
          <Text size="sm" c="dimmed">
            Showing {paginatedProjects.length} of {filteredProjects.length} projects
          </Text>

          {/* Projects Grid/List */}
          {viewMode === 'grid' ? (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {paginatedProjects.map((project) => {
                const likeCount = project._count?.likes || 0
                const commentCount = project._count?.comments || 0
                const isLiked = project.isLiked || likedProjects.has(project.id)
                                console.log("isliked",isLiked)

                return (
                  <Card key={project.id} padding="lg" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                    <Card.Section>
                      <Box
                        h={160}
                        style={{
                          background: project.imageUrl 
                            ? `url(${project.imageUrl})` 
                            : 'linear-gradient(135deg, #228be6 0%, #be4bdb 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative',
                        }}
                      >
                        {project.githubUrl && (
                          <ActionIcon
                            component="a"
                            href={project.githubUrl}
                            target="_blank"
                            variant="filled"
                            style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: 'rgba(255,255,255,0.2)',
                            }}
                          >
                            <IconBrandGithub size={18} />
                          </ActionIcon>
                        )}
                        <Group gap="xs" style={{ position: 'absolute', bottom: 12, left: 12 }}>
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="filled" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                              {tech}
                            </Badge>
                          ))}
                        </Group>
                      </Box>
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                      <Title order={3} size="h4" lineClamp={1} c={isDark ? 'white' : 'dark.9'}>
                        {project.title}
                      </Title>
                      <Badge color={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                      {project.description}
                    </Text>

                    <Group gap="xs" mb="md">
                      <Avatar size="sm" radius="xl" color="blue">
                        {project.user.fullName[0].toUpperCase()}
                      </Avatar>
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>{project.user.fullName}</Text>
                        <Group gap={4}>
                          <IconCalendar size={12} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                          <Text size="xs" c="dimmed">{formatDate(project.createdAt)}</Text>
                        </Group>
                      </Box>
                    </Group>

                    <Box mb="md">
                      <Group justify="space-between" mb={4}>
                        <Text size="xs" c="dimmed">Progress</Text>
                        <Text size="xs" c="dimmed">{project.progress}%</Text>
                      </Group>
                      <Progress value={project.progress} size="sm" />
                    </Box>

                    <Group justify="space-between" mb="md">
                      <Group gap="sm">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleLike(project.id)}
                          color={isLiked ? 'red' : isDark ? 'gray.4' : 'gray.7'}
                        >
                          {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                        </ActionIcon>
                        <Text size="sm" c="dimmed">{likeCount}</Text>
                        
                        <ActionIcon
                          variant="subtle"
                          component={Link}
                          href={`/myprojects/${project.id}#comments`}
                          color={isDark ? 'gray.4' : 'gray.7'}
                        >
                          <IconMessageCircle size={18} />
                        </ActionIcon>
                        <Text size="sm" c="dimmed">{commentCount}</Text>
                      </Group>
                    </Group>

                    <Button
                      component={Link}
                      href={`/myprojects/${project.id}`}
                      variant="light"
                      fullWidth
                      rightSection={<IconArrowRight size={16} />}
                    >
                      View Details
                    </Button>
                  </Card>
                )
              })}
            </SimpleGrid>
          ) : (
            <Stack gap="md">
              {paginatedProjects.map((project) => {
                const isLiked = project.isLiked || likedProjects.has(project.id)
                console.log("isliked",isLiked)
                return (
                  <Paper key={project.id} p="md" radius="md" withBorder style={{ backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
                    <Group align="flex-start" wrap="nowrap">
                      <Avatar size="lg" radius="md" color="blue">
                        {project.title[0].toUpperCase()}
                      </Avatar>
                      
                      <Box style={{ flex: 1 }}>
                        <Group justify="space-between" mb="xs">
                          <Group gap="xs">
                            <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>{project.title}</Title>
                            <Badge color={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </Group>
                          <Group gap="xs">
                            
                            <ActionIcon
                              variant="subtle"
                              onClick={() => handleLike(project.id)}
                              color={isLiked ? 'red' : isDark ? 'gray.4' : 'gray.7'}
                            >
                              {isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                            </ActionIcon>
                            <Button
                              component={Link}
                              href={`/myprojects/${project.id}`}
                              variant="light"
                              size="xs"
                              rightSection={<IconArrowRight size={14} />}
                            >
                              View
                            </Button>
                          </Group>
                        </Group>

                        <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>
                          {project.description}
                        </Text>

                        <Group gap="xs" mb="xs">
                          {project.technologies.slice(0, 3).map(tech => (
                            <Badge key={tech} variant="outline" size="sm">{tech}</Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" size="sm">+{project.technologies.length - 3}</Badge>
                          )}
                        </Group>

                        <Group gap="lg">
                          <Group gap={4}>
                            <IconHeart size={14} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                            <Text size="xs" c="dimmed">{project._count?.likes || 0}</Text>
                          </Group>
                          <Group gap={4}>
                            <IconMessageCircle size={14} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                            <Text size="xs" c="dimmed">{project._count?.comments || 0}</Text>
                          </Group>
                          <Group gap={4}>
                            <IconUsers size={14} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                            <Text size="xs" c="dimmed">{project.user.fullName}</Text>
                          </Group>
                        </Group>
                      </Box>
                    </Group>
                  </Paper>
                )
              })}
            </Stack>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
                withEdges
                styles={{
                  control: {
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    color: isDark ? 'white' : 'black',
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  },
                }}
              />
            </Group>
          )}

          {/* No Projects */}
          {filteredProjects.length === 0 && (
            <Paper p="xl" radius="md" withBorder style={{ textAlign: 'center', backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <ThemeIcon size={60} radius="xl" variant="light" color="gray" mx="auto" mb="md">
                <IconCode size={30} />
              </ThemeIcon>
              <Title order={3} mb="xs" c={isDark ? 'white' : 'dark.9'}>No projects found</Title>
              <Text c="dimmed" mb="lg">
                {searchQuery || selectedTech || selectedStatus 
                  ? 'Try adjusting your filters' 
                  : 'Check back later for new projects'}
              </Text>
              {(searchQuery || selectedTech || selectedStatus) && (
                <Button onClick={clearFilters} variant="light">
                  Clear all filters
                </Button>
              )}
            </Paper>
          )}
        </Stack>
      </Container>

      {/* Mobile Filter Modal */}
      <Modal opened={filterOpened} onClose={close} title="Filters" centered>
        <Stack gap="md">
          <Select
            label="Technology"
            placeholder="Select technology"
            data={techStack}
            value={selectedTech}
            onChange={setSelectedTech}
            clearable
          />
          
          <Select
            label="Status"
            placeholder="Select status"
            data={[
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'on-hold', label: 'On Hold' },
              { value: 'planning', label: 'Planning' },
            ]}
            value={selectedStatus}
            onChange={setSelectedStatus}
            clearable
          />
          
          <Select
            label="Sort by"
            placeholder="Select sort"
            data={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'mostLiked', label: 'Most Liked' },
              { value: 'mostCommented', label: 'Most Commented' },
              { value: 'progress', label: 'Progress' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value || 'newest')}
          />

          <Group gap="sm" mt="md">
            <Button variant="light" onClick={clearFilters} style={{ flex: 1 }}>
              Clear all
            </Button>
            <Button onClick={close} style={{ flex: 1 }}>
              Apply
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Footer */}
      <Footer />
    </Box>
  )
}