// app/profile/page.tsx
'use client'

import {
  Container,
  Title,
  Text,
  Paper,
  Avatar,
  Group,
  Stack,
  Badge,
  SimpleGrid,
  Divider,
  Button,
  TextInput,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import {
  IconMail,
  IconUser,
  IconCalendar,
  IconClock,
  IconEdit,
  IconShield,
} from '@tabler/icons-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return 'U'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Title order={1} size="h1" c={isDark ? 'white' : 'dark.9'}>
            Profile
          </Title>
          <Text size="sm" c="dimmed">
            Manage your personal information and account settings
          </Text>
        </div>

        {/* Profile Card */}
        <Paper
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[7] : 'white',
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          }}
        >
          <Stack gap="lg" p="xl">
            {/* Avatar and Basic Info */}
            <Group justify="space-between" align="flex-start">
              <Group gap="lg">
                <Avatar
                  src={user?.avatarUrl}
                  size={100}
                  radius="xl"
                  color="blue"
                  style={{
                    border: `4px solid ${isDark ? theme.colors.blue[8] : theme.colors.blue[5]}`,
                  }}
                >
                  <Text size="3rem" fw={700} c="white">
                    {getUserInitial()}
                  </Text>
                </Avatar>
                <div>
                  <Group gap="xs" mb={4}>
                    <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                      {user?.fullName || 'User Name'}
                    </Title>
                    <Badge 
                      size="lg" 
                      color={user?.role === 'admin' ? 'grape' : 'blue'}
                      variant="light"
                    >
                      <Group gap={4}>
                        <IconShield size={14} />
                        {user?.role || 'user'}
                      </Group>
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={16} color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]} />
                    <Text size="sm" c="dimmed">{user?.email || 'email@example.com'}</Text>
                  </Group>
                </div>
              </Group>
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                color={isDark ? 'gray.4' : 'dark.6'}
              >
                Edit Profile
              </Button>
            </Group>

            <Divider 
              style={{
                borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
              }}
            />

            {/* Account Details */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                }}
              >
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconCalendar size={18} color={theme.colors.blue[6]} />
                    <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                      Member Since
                    </Text>
                  </Group>
                  <Text size="lg" fw={600} c={isDark ? 'white' : 'dark.9'}>
                    {formatDate(user?.createdAt)}
                  </Text>
                </Stack>
              </Paper>

              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                }}
              >
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconClock size={18} color={theme.colors.green[6]} />
                    <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                      Last Login
                    </Text>
                  </Group>
                  <Text size="lg" fw={600} c={isDark ? 'white' : 'dark.9'}>
                    {formatDate(user?.lastLogin)}
                  </Text>
                </Stack>
              </Paper>
            </SimpleGrid>

            {/* Account Status */}
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                    Account Status
                  </Text>
                  <Badge color="green" variant="light">Active</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                    Email Verified
                  </Text>
                  <Badge color="green" variant="light">Yes</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                    Two-Factor Authentication
                  </Text>
                  <Badge color="yellow" variant="light">Not Enabled</Badge>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Paper>

        {/* Edit Profile Form (Hidden by default) */}
        <Paper
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[7] : 'white',
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
            display: 'none', // Hide for now, can be toggled with state
          }}
        >
          <Stack gap="md" p="xl">
            <Title order={3} size="h3" c={isDark ? 'white' : 'dark.9'}>
              Edit Profile
            </Title>
            <TextInput
              label="Full Name"
              placeholder="Your full name"
              defaultValue={user?.fullName}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />
            <TextInput
              label="Email"
              placeholder="Your email"
              defaultValue={user?.email}
              disabled
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />
            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="subtle" color={isDark ? 'gray.4' : 'dark.6'}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: 'blue', to: 'grape', deg: 135 }}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}