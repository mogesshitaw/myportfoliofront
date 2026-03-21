/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react"
import {
  Box,
  Text,
  TextInput,
  Button,
  Avatar,
  Stack,
  Group,
  Paper,
  Loader,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconSend, IconMessage, IconUser } from "@tabler/icons-react"
import apiClient from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content?: string
  createdAt: string
  user?: {
    fullName?: string
    avatarUrl?: string
  }
}

export function Comments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const form = useForm({
    initialValues: {
      comment: "",
    },
    validate: {
      comment: (value) => (value.trim().length < 1 ? "Comment cannot be empty" : null),
    },
  })

  useEffect(() => {
    if (projectId) {
      fetchComments()
    }
  }, [projectId])

  const fetchComments = async () => {
    setIsFetching(true)
    try {
      const { data } = await apiClient.get(`/projects/${projectId}/comments`)
      const commentsData = data?.data || data || []
      setComments(Array.isArray(commentsData) ? commentsData : [])
    } catch (error) {
      console.error("Failed to fetch comments:", error)
      notifications.show({
        title: "Error",
        message: "Failed to load comments",
        color: "red",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.comment.trim()) return

    setIsLoading(true)
    try {
      const response = await apiClient.post(`/projects/${projectId}/comments`, {
        content: values.comment
      })

      const newCommentData = response?.data?.data
      if (newCommentData) {
        setComments(prev => [newCommentData, ...prev])
      }

      form.reset()
      
      notifications.show({
        title: "Success",
        message: "Comment added successfully",
        color: "green",
      })
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.error || "Failed to post comment",
        color: "red",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitial = (name?: string) => {
    if (!name) return "U"
    return name.charAt(0).toUpperCase()
  }

  return (
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
        {/* Header */}
        <Group justify="space-between">
          <Group gap="xs">
            <IconMessage size={20} color={isDark ? theme.colors.gray[4] : theme.colors.gray[7]} />
            <Text 
              size="lg" 
              fw={600}
              c={isDark ? 'white' : 'dark.9'}
            >
              Comments ({comments.length})
            </Text>
          </Group>
        </Group>

        {/* Comment Input Form */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group align="flex-start" gap="sm">
            <Avatar
              radius="xl"
              color="blue"
              style={{ flexShrink: 0 }}
            >
              <IconUser size={20} />
            </Avatar>
            
            <Box style={{ flex: 1 }}>
              <TextInput
                placeholder="Write a comment..."
                {...form.getInputProps('comment')}
                disabled={isLoading}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    color: isDark ? 'white' : 'black',
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              loading={isLoading}
              disabled={!form.values.comment.trim()}
              variant="gradient"
              gradient={{ from: 'blue', to: 'grape', deg: 135 }}
              leftSection={!isLoading && <IconSend size={16} />}
              style={{ flexShrink: 0 }}
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </Group>
        </form>

        {/* Comments List */}
        <Stack gap="md" mt="md">
          {isFetching && (
            <Box style={{ textAlign: 'center', padding: '20px' }}>
              <Loader size="sm" color={isDark ? 'white' : 'blue'} />
              <Text size="sm" c="dimmed" mt="xs">
                Loading comments...
              </Text>
            </Box>
          )}

          {!isFetching && comments.length === 0 && (
            <Paper
              p="xl"
              radius="md"
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                textAlign: 'center',
              }}
            >
              <IconMessage 
                size={40} 
                color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} 
                style={{ marginBottom: '10px' }}
              />
              <Text size="sm" c="dimmed">
                No comments yet. Be the first to comment!
              </Text>
            </Paper>
          )}

          {comments.map((comment) => {
            const name = comment.user?.fullName || "User"
            const initial = getUserInitial(name)

            return (
              <Paper
                key={comment.id}
                p="md"
                radius="md"
                withBorder
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              >
                <Group align="flex-start" gap="sm" wrap="nowrap">
                  <Avatar
                    src={comment.user?.avatarUrl}
                    radius="xl"
                    color="blue"
                    size="md"
                  >
                    {initial}
                  </Avatar>

                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" wrap="nowrap">
                      <Text 
                        size="sm" 
                        fw={600}
                        c={isDark ? 'white' : 'dark.9'}
                      >
                        {name}
                      </Text>
                      <Text 
                        size="xs" 
                        c="dimmed"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {comment.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                          : "just now"}
                      </Text>
                    </Group>

                    <Text 
                      size="sm" 
                      mt={4}
                      c={isDark ? theme.colors.gray[3] : theme.colors.dark[6]}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {comment.content || "No comment text"}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            )
          })}
        </Stack>
      </Stack>
    </Paper>
  )
}