'use client'

import {
  Group,
  Title,
  Text,
  Button,
  Modal,
  Stack,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconUsers } from '@tabler/icons-react'
import { UserForm } from './user-form'

export function UsersHeader() {
  const [opened, { open, close }] = useDisclosure(false)
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <>
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="xs" mb={4}>
            <IconUsers size={24} color={isDark ? theme.colors.blue[5] : theme.colors.blue[6]} />
            <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
              User Management
            </Title>
          </Group>
          <Text size="sm" c="dimmed" ml={32}>
            Manage users, roles, and permissions
          </Text>
        </div>
        
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={open}
          variant="gradient"
          gradient={{ from: 'blue', to: 'grape', deg: 135 }}
          size="md"
        >
          Add New User
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title="Create New User"
        centered
        size="lg"
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
            fontSize: theme.fontSizes.lg,
          },
        }}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Add a new user to the system. They will receive an email with login instructions.
          </Text>
          <UserForm onSuccess={close} />
        </Stack>
      </Modal>
    </>
  )
}