/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Avatar,
  Badge,
  Button,
  Menu,
  Modal,
  Text,
  Group,
  Stack,
  Paper,
  Loader,
  Center,
  ActionIcon,
  useMantineTheme,
  useMantineColorScheme,
  Alert,
  Box,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconUser,
  IconMail,
  IconCalendar,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react'
import { UserForm } from './user-form'
import apiClient from '@/lib/api'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
  avatarUrl?: string
  lastLogin?: string
  createdAt: string
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [statusOpened, { open: openStatus, close: closeStatus }] = useDisclosure(false)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/admin/users')
      setUsers(data.data)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to load users'
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    openEdit()
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    openDelete()
  }

  const handleStatusChange = (user: User) => {
    setSelectedUser(user)
    openStatus()
  }

  const confirmDelete = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      await apiClient.delete(`/admin/users/${selectedUser.id}`)
      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
      })
      fetchUsers()
      closeDelete()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete user'
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const confirmStatusChange = async () => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      await apiClient.patch(`/admin/users/${selectedUser.id}/status`, {
        isActive: !selectedUser.isActive
      })
      notifications.show({
        title: 'Success',
        message: `User ${!selectedUser.isActive ? 'activated' : 'deactivated'} successfully`,
        color: 'green',
      })
      fetchUsers()
      closeStatus()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update user status'
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      setSelectedUser(null)
    }
  }

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Center style={{ minHeight: 400 }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={isDark ? 'white' : 'blue'} />
          <Text c="dimmed">Loading users...</Text>
        </Stack>
      </Center>
    )
  }

  return (
    <>
      <Paper
        radius="md"
        withBorder
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          overflow: 'hidden',
        }}
      >
        <Table striped highlightOnHover>
          <Table.Thead style={{
            backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
          }}>
            <Table.Tr>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>User</Table.Th>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>Role</Table.Th>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>Status</Table.Th>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>Last Login</Table.Th>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>Joined</Table.Th>
              <Table.Th style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6], textAlign: 'right' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Stack align="center" gap="sm">
                      <IconUser size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} />
                      <Text size="lg" fw={500} c="dimmed">No users found</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        src={user.avatarUrl}
                        radius="xl"
                        size="md"
                        color="blue"
                      >
                        {getUserInitial(user.fullName)}
                      </Avatar>
                      <Box>
                        <Text size="sm" fw={500} c={isDark ? 'white' : 'dark.9'}>
                          {user.fullName}
                        </Text>
                        <Group gap={4}>
                          <IconMail size={12} color={isDark ? theme.colors.gray[6] : theme.colors.gray[6]} />
                          <Text size="xs" c="dimmed">{user.email}</Text>
                        </Group>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant={user.role === 'admin' ? 'filled' : 'light'}
                      color={user.role === 'admin' ? 'blue' : 'gray'}
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={user.isActive ? 'green' : 'red'}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <IconClock size={14} color={isDark ? theme.colors.gray[6] : theme.colors.gray[6]} />
                      <Text size="sm" c="dimmed">{formatDate(user.lastLogin)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <IconCalendar size={14} color={isDark ? theme.colors.gray[6] : theme.colors.gray[6]} />
                      <Text size="sm" c="dimmed">{formatDate(user.createdAt)}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}>
                    <Menu position="bottom-end" offset={5}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color={isDark ? 'gray.4' : 'dark.6'}>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown
                        style={{
                          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                        }}
                      >
                        <Menu.Label
                          style={{
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          }}
                        >
                          Actions
                        </Menu.Label>
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          onClick={() => handleEdit(user)}
                          style={{
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                            '&:hover': {
                              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                            },
                          }}
                        >
                          Edit User
                        </Menu.Item>
                        <Menu.Item
                          leftSection={user.isActive ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                          onClick={() => handleStatusChange(user)}
                          style={{
                            color: user.isActive ? theme.colors.orange[6] : theme.colors.green[6],
                            '&:hover': {
                              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                            },
                          }}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                        <Menu.Divider
                          style={{
                            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                          }}
                        />
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          onClick={() => handleDelete(user)}
                          style={{
                            color: theme.colors.red[6],
                            '&:hover': {
                              backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.red[0],
                            },
                          }}
                        >
                          Delete User
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Edit Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit User"
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
          },
        }}
      >
        <UserForm 
          initialData={selectedUser}
          onSuccess={() => {
            closeEdit()
            fetchUsers()
            notifications.show({
              title: 'Success',
              message: 'User updated successfully',
              color: 'green',
            })
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete User"
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
        <Stack gap="lg">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Are you sure?"
            color="red"
            variant="light"
          >
            This action cannot be undone. This will permanently delete the user
            <Text component="span" fw={600} c="red.6"> {selectedUser?.fullName} </Text> 
            and remove all their data from the server.
          </Alert>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeDelete} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              loading={actionLoading}
              loaderProps={{ type: 'dots' }}
            >
              {actionLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Status Change Confirmation Modal */}
      <Modal
        opened={statusOpened}
        onClose={closeStatus}
        title={selectedUser?.isActive ? 'Deactivate User' : 'Activate User'}
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
            color: selectedUser?.isActive ? theme.colors.orange[6] : theme.colors.green[6],
            fontWeight: 600,
          },
        }}
      >
        <Stack gap="lg">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Confirmation"
            color={selectedUser?.isActive ? 'orange' : 'green'}
            variant="light"
          >
            {selectedUser?.isActive 
              ? `Are you sure you want to deactivate `
              : `Are you sure you want to activate `}
            <Text component="span" fw={600} c={selectedUser?.isActive ? 'orange.6' : 'green.6'}>
              {selectedUser?.fullName}
            </Text>
            {selectedUser?.isActive 
              ? `? They will not be able to log in.`
              : `? They will be able to log in again.`}
          </Alert>

          <Paper
            p="md"
            radius="md"
            style={{
              backgroundColor: selectedUser?.isActive 
                ? (isDark ? 'rgba(255, 165, 0, 0.1)' : '#fff3e0')
                : (isDark ? 'rgba(0, 255, 0, 0.1)' : '#e8f5e9'),
            }}
          >
            <Text size="sm" c={selectedUser?.isActive ? 'orange.6' : 'green.6'}>
              {selectedUser?.isActive 
                ? 'Deactivating this user will prevent them from logging into their account.'
                : 'Activating this user will restore their access to the system.'}
            </Text>
          </Paper>

          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={closeStatus} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              color={selectedUser?.isActive ? 'orange' : 'green'}
              onClick={confirmStatusChange}
              loading={actionLoading}
              loaderProps={{ type: 'dots' }}
            >
              {actionLoading 
                ? (selectedUser?.isActive ? 'Deactivating...' : 'Activating...')
                : (selectedUser?.isActive ? 'Deactivate' : 'Activate')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}