/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Modal,
  Text,
  Group,
  Stack,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash, IconAlertCircle, IconLoader2 } from '@tabler/icons-react'
import apiClient from '@/lib/api'

interface DeleteProjectButtonProps {
  projectId: string
  projectTitle: string
}

export function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [opened, setOpened] = useState(false)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`/projects/${projectId}`)
      
      notifications.show({
        title: 'Success',
        message: 'Project deleted successfully',
        color: 'green',
      })
      
      setOpened(false)
      router.push('/projects')
      router.refresh()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to delete project',
        color: 'red',
      })
      setOpened(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="filled"
        color="red"
        fullWidth
        leftSection={<IconTrash size={18} />}
        onClick={() => setOpened(true)}
        styles={{
          root: {
            backgroundColor: isDark ? theme.colors.red[8] : theme.colors.red[6],
            '&:hover': {
              backgroundColor: isDark ? theme.colors.red[7] : theme.colors.red[7],
            },
          },
        }}
      >
        Delete Project
      </Button>

      <Modal
        opened={opened}
        onClose={() => !isDeleting && setOpened(false)}
        title={
          <Group gap="xs">
            <IconAlertCircle 
              size={24} 
              color={isDark ? theme.colors.red[5] : theme.colors.red[6]} 
            />
            <Text size="lg" fw={600} c={isDark ? 'white' : 'dark.9'}>
              Delete Project
            </Text>
          </Group>
        }
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
          },
          overlay: {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Stack gap="lg">
          <Text size="sm" c={isDark ? theme.colors.gray[3] : theme.colors.dark[6]}>
            This action cannot be undone. This will permanently delete the project
            <Text component="span" fw={600} c={isDark ? 'white' : 'dark.9'}>
              {' '}{projectTitle}{' '}
            </Text>
            and remove all its data from our servers.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setOpened(false)}
              disabled={isDeleting}
              color={isDark ? 'gray.4' : 'dark.6'}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={handleDelete}
              loading={isDeleting}
              loaderProps={{ type: 'dots' }}
              leftSection={!isDeleting && <IconTrash size={18} />}
              styles={{
                root: {
                  backgroundColor: isDark ? theme.colors.red[8] : theme.colors.red[6],
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.red[7] : theme.colors.red[7],
                  },
                },
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}