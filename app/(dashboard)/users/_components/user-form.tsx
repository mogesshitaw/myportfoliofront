/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Stack,
  Box,
  Paper,
  LoadingOverlay,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconUser, IconMail, IconLock, IconUserCircle } from '@tabler/icons-react'
import apiClient from '@/lib/api'

interface UserFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const form = useForm({
    initialValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || 'client',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Full name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address'),
      password: (value) => {
        if (!initialData && value.length < 6) {
          return 'Password must be at least 6 characters'
        }
        return null
      },
    },
  })

  useEffect(() => {
    setServerErrors({})
  }, [initialData])

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    setServerErrors({})

    const data = {
      fullName: values.fullName,
      email: values.email,
      ...(!initialData && { password: values.password }),
      role: values.role,
    }

    try {
      if (initialData) {
        // Update existing user
        await apiClient.put(`/admin/users/${initialData.id}`, data)
        notifications.show({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
        })
      } else {
        // Create new user
        await apiClient.post('/admin/users', data)
        notifications.show({
          title: 'Success',
          message: 'User created successfully',
          color: 'green',
        })
        
        // Reset form
        form.reset()
      }
      
      if (onSuccess) onSuccess()
      
    } catch (error: any) {
      console.error('Form error:', error)
      
      if (error.response?.data?.errors) {
        const validationErrors: Record<string, string> = {}
        error.response.data.errors.forEach((err: any) => {
          validationErrors[err.path] = err.msg
        })
        setServerErrors(validationErrors)
        
        // Set form errors
        Object.entries(validationErrors).forEach(([field, message]) => {
          form.setFieldError(field, message)
        })
      } 
      else if (error.response?.data?.error) {
        notifications.show({
          title: 'Error',
          message: error.response.data.error,
          color: 'red',
        })
        
        if (error.response.data.error.includes('already exists')) {
          form.setFieldError('email', 'This email is already registered')
        }
      } 
      else {
        notifications.show({
          title: 'Error',
          message: 'Failed to connect to server',
          color: 'red',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box pos="relative" style={{ maxWidth: 500, margin: '0 auto' }}>
      <LoadingOverlay visible={isLoading} />
      
      <Paper
        p="xl"
        radius="md"
        withBorder
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : 'white',
          borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {/* Server Errors Alert */}
            {Object.keys(serverErrors).length > 0 && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Validation Error"
                color="red"
                variant="light"
                withCloseButton
                onClose={() => setServerErrors({})}
              >
                Please fix the errors below
              </Alert>
            )}

            {/* Full Name */}
            <TextInput
              required
              label="Full Name"
              placeholder="John Doe"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('fullName')}
              disabled={isLoading}
              error={form.errors.fullName || serverErrors.fullName}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  marginBottom: '4px',
                },
              }}
            />

            {/* Email */}
            <TextInput
              required
              label="Email"
              type="email"
              placeholder="john@example.com"
              leftSection={<IconMail size={16} />}
              {...form.getInputProps('email')}
              disabled={isLoading}
              error={form.errors.email || serverErrors.email}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  marginBottom: '4px',
                },
              }}
            />

            {/* Password (only for new users) */}
            {!initialData && (
              <PasswordInput
                required
                label="Password"
                placeholder="••••••••"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps('password')}
                disabled={isLoading}
                error={form.errors.password || serverErrors.password}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                  label: {
                    color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                    marginBottom: '4px',
                  },
                }}
              />
            )}

            {/* Role */}
            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: 'client', label: 'Client' },
                { value: 'admin', label: 'Admin' },
              ]}
              leftSection={<IconUserCircle size={16} />}
              {...form.getInputProps('role')}
              disabled={isLoading}
              error={form.errors.role || serverErrors.role}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  marginBottom: '4px',
                },
                dropdown: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
                },
                option: {
                  color: isDark ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                  },
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isLoading}
              loaderProps={{ type: 'dots' }}
              variant="gradient"
              gradient={{ from: 'blue', to: 'grape', deg: 135 }}
              mt="md"
            >
              {initialData ? 'Update User' : 'Create User'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}