/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Button,
  TextInput,
  PasswordInput,
  Avatar,
  FileInput,
  Alert,
  Tabs,
  Box,
  LoadingOverlay,
  Progress,
  useMantineTheme,
  useMantineColorScheme,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconLock,
  IconUser,
  IconSun,
  IconMoon,
  IconCheck,
  IconX,
  IconUpload,
  IconPhoto,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';


interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { user, isLoading: authLoading, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Profile Form
  const profileForm = useForm({
    initialValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      avatarFile: null as File | null,
      avatarUrl: user?.avatarUrl || '',
    },
    validate: {
      fullName: (value: string) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  // Password Form
  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value: string) => (value.length < 1 ? 'Current password is required' : null),
      newPassword: (value: string) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value: string, values: any) =>
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.setValues({
        fullName: user.fullName || '',
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
      });
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success) {
        setProfile(response.data.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        },
      });

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
      
      return response.data.imageUrl;
    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      setUploadError(error.response?.data?.error || 'Failed to upload avatar');
      setTimeout(() => setUploadError(null), 3000);
      return null;
    }
  };

  const handleProfileUpdate = async (values: typeof profileForm.values) => {
    setLoading(true);
    setUploadError(null);

    try {
      let avatarUrl = values.avatarUrl;

      if (values.avatarFile) {
        const uploadedUrl = await handleAvatarUpload(values.avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error('Avatar upload failed');
        }
      }

      const response = await apiClient.put('/auth/profile', {
        fullName: values.fullName,
        email: values.email,
        avatarUrl: avatarUrl || undefined,
      });

      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: 'Profile updated successfully',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        
        // Update local user data
        if (updateUser) {
          updateUser({
            ...user,
            fullName: values.fullName,
            avatarUrl: avatarUrl,
          });
        }
        
        fetchProfile();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to update profile',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: typeof passwordForm.values) => {
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (response.data.success) {
        notifications.show({
          title: 'Success',
          message: 'Password changed successfully',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        
        passwordForm.reset();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to change password',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAvatarFile = () => {
    profileForm.setFieldValue('avatarFile', null);
    setUploadProgress(0);
  };

  const removeCurrentAvatar = () => {
    profileForm.setFieldValue('avatarUrl', '');
  };

  if (authLoading) {
    return (
      <>
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa' 
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color={isDark ? 'white' : 'blue'} />
              <Text c="dimmed">Loading settings...</Text>
            </Stack>
          </Center>
        </Box>
      </>
    );
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>

      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Box>
            <Title order={1} size="h2" c={isDark ? 'white' : 'dark.9'}>
              Settings
            </Title>
            <Text c="dimmed" mt={4}>
              Manage your account settings and preferences
            </Text>
          </Box>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
            <Tabs.List>
              <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                Profile Settings
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
                Security
              </Tabs.Tab>
              <Tabs.Tab value="appearance" leftSection={<IconPhoto size={16} />}>
                Appearance
              </Tabs.Tab>
            </Tabs.List>

            {/* Profile Settings Tab */}
            <Tabs.Panel value="profile" pt="xl">
              <Paper
                p="xl"
                radius="md"
                withBorder
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              >
                <Box pos="relative">
                  <LoadingOverlay visible={loading} />
                  
                  <form onSubmit={profileForm.onSubmit(handleProfileUpdate)}>
                    <Stack gap="lg">
                      <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                        Profile Information
                      </Title>

                      {/* Avatar Section */}
                      <div>
                        <Text size="sm" fw={500} mb={4} c={isDark ? 'gray.3' : 'dark.6'}>
                          Profile Picture
                        </Text>
                        
                        {/* Current Avatar Preview */}
                        {profileForm.values.avatarUrl && !profileForm.values.avatarFile && (
                          <Box mb="md">
                            <Group justify="space-between" mb="xs">
                              <Text size="sm" c="dimmed">Current Avatar:</Text>
                              <Button
                                variant="subtle"
                                color="red"
                                size="xs"
                                onClick={removeCurrentAvatar}
                              >
                                Remove
                              </Button>
                            </Group>
                            <Avatar
                              src={profileForm.values.avatarUrl}
                              size={100}
                              radius={100}
                              style={{ border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}
                            />
                          </Box>
                        )}

                        <FileInput
                          label="Upload New Avatar"
                          placeholder="Click to upload"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          leftSection={<IconUpload size={16} />}
                          value={profileForm.values.avatarFile}
                          onChange={(file) => {
                            profileForm.setFieldValue('avatarFile', file);
                            setUploadError(null);
                          }}
                          styles={{
                            input: {
                              backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                              color: isDark ? 'white' : 'black',
                            },
                            label: {
                              color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                            },
                          }}
                        />

                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <Box mt="xs">
                            <Group justify="space-between" mb={4}>
                              <Text size="xs" c="dimmed">Uploading...</Text>
                              <Text size="xs" c="dimmed">{uploadProgress}%</Text>
                            </Group>
                            <Progress value={uploadProgress} size="sm" color="blue" />
                          </Box>
                        )}

                        {profileForm.values.avatarFile && (
                          <Box mt="sm">
                            <Group justify="space-between" mb="xs">
                              <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.6'}>
                                Preview:
                              </Text>
                              <Button
                                variant="subtle"
                                color="red"
                                size="xs"
                                onClick={clearAvatarFile}
                              >
                                Remove
                              </Button>
                            </Group>
                            <Avatar
                              src={URL.createObjectURL(profileForm.values.avatarFile)}
                              size={100}
                              radius={100}
                              style={{ border: `2px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}
                            />
                          </Box>
                        )}

                        {uploadError && (
                          <Alert color="red" title="Upload Error" variant="light" mt="xs">
                            {uploadError}
                          </Alert>
                        )}

                        <Text size="xs" c="dimmed" mt={4}>
                          Recommended size: 200x200px. Max size: 2MB.
                        </Text>
                      </div>

                      <TextInput
                        required
                        label="Full Name"
                        placeholder="Your full name"
                        {...profileForm.getInputProps('fullName')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                            color: isDark ? 'white' : 'black',
                          },
                          label: {
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          },
                        }}
                      />

                      <TextInput
                        required
                        label="Email Address"
                        placeholder="your@email.com"
                        {...profileForm.getInputProps('email')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                            color: isDark ? 'white' : 'black',
                          },
                          label: {
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          },
                        }}
                      />

                      <Group justify="flex-end">
                        <Button
                          type="submit"
                          loading={loading}
                          leftSection={<IconDeviceFloppy size={16} />}
                          variant="gradient"
                          gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                        >
                          Save Changes
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </Box>
              </Paper>
            </Tabs.Panel>

            {/* Security Tab */}
            <Tabs.Panel value="security" pt="xl">
              <Paper
                p="xl"
                radius="md"
                withBorder
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              >
                <Box pos="relative">
                  <LoadingOverlay visible={loading} />
                  
                  <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
                    <Stack gap="lg">
                      <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                        Change Password
                      </Title>

                      <PasswordInput
                        required
                        label="Current Password"
                        placeholder="Enter current password"
                        {...passwordForm.getInputProps('currentPassword')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                            color: isDark ? 'white' : 'black',
                          },
                          label: {
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          },
                        }}
                      />

                      <PasswordInput
                        required
                        label="New Password"
                        placeholder="Enter new password"
                        {...passwordForm.getInputProps('newPassword')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                            color: isDark ? 'white' : 'black',
                          },
                          label: {
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          },
                        }}
                      />

                      <PasswordInput
                        required
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        {...passwordForm.getInputProps('confirmPassword')}
                        styles={{
                          input: {
                            backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                            color: isDark ? 'white' : 'black',
                          },
                          label: {
                            color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                          },
                        }}
                      />

                      <Group justify="flex-end">
                        <Button
                          type="submit"
                          loading={loading}
                          leftSection={<IconLock size={16} />}
                          variant="gradient"
                          gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                        >
                          Change Password
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </Box>
              </Paper>
            </Tabs.Panel>

            {/* Appearance Tab */}
            <Tabs.Panel value="appearance" pt="xl">
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Paper
                  p="xl"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => toggleColorScheme()}
                  className="hover:shadow-lg hover:-translate-y-1"
                >
                  <Stack align="center" gap="md">
                    <Box
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        background: isDark 
                          ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
                          : 'linear-gradient(135deg, #f8f9fa, #ffffff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${isDark ? theme.colors.blue[6] : theme.colors.blue[5]}`,
                      }}
                    >
                      {isDark ? <IconSun size={32} /> : <IconMoon size={32} />}
                    </Box>
                    <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </Title>
                    <Text size="sm" c="dimmed" ta="center">
                      Currently using {isDark ? 'dark' : 'light'} theme
                    </Text>
                    <Button variant="light" fullWidth>
                      Switch to {isDark ? 'Light' : 'Dark'} Mode
                    </Button>
                  </Stack>
                </Paper>

                <Paper
                  p="xl"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  }}
                >
                  <Stack align="center" gap="md">
                    <Box
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconUser size={40} color="white" />
                    </Box>
                    <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                      Brand Colors
                    </Title>
                    <Text size="sm" c="dimmed" ta="center">
                      Customize the look and feel of your dashboard
                    </Text>
                    <Group gap="xs">
                      <Box w={40} h={40} style={{ background: '#667eea', borderRadius: 8 }} />
                      <Box w={40} h={40} style={{ background: '#764ba2', borderRadius: 8 }} />
                      <Box w={40} h={40} style={{ background: '#3b82f6', borderRadius: 8 }} />
                      <Box w={40} h={40} style={{ background: '#10b981', borderRadius: 8 }} />
                    </Group>
                    <Button variant="light" fullWidth disabled>
                      Coming Soon
                    </Button>
                  </Stack>
                </Paper>
              </SimpleGrid>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>

    </Box>
  );
}