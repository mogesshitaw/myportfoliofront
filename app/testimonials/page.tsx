/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Avatar,
  Rating,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Box,
  Loader,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
  Paper,
  Divider,
  FileInput,
  Image,
  Progress,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconStar, IconSend, IconCheck, IconAlertCircle, IconQuote, IconUpload, IconX } from '@tabler/icons-react';
import Navbar from '@/app/components/Navbar';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '../components/Footer';

interface Testimonial {
  id: string;
  author: string;
  position: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  featured?: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Form for submitting a new testimonial
  const form = useForm({
    initialValues: {
      author: user?.fullName || '',
      position: '',
      content: '',
      rating: 5,
      avatarFile: null as File | null,
      avatarUrl: '',
    },
    validate: {
      author: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      position: (value) => (value.length < 2 ? 'Position/Company is required' : null),
      content: (value) => (value.length < 10 ? 'Please write at least 10 characters' : null),
      rating: (value) => (value < 1 || value > 5 ? 'Rating must be between 1 and 5' : null),
    },
  });

  // Auto-fill author if user is logged in
  useEffect(() => {
    if (user?.fullName) {
      form.setFieldValue('author', user.fullName);
    }
  }, [user]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/testimonials?limit=20');
      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.response?.data?.error || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

 const handleImageUpload = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await apiClient.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        setUploadProgress(percentCompleted);
      },
    });

    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 1000);
    
    return response.data.imageUrl;
  } catch (error: any) {
    console.error('Image upload failed:', error);
    setUploadError(error.response?.data?.error || 'Failed to upload image');
    setTimeout(() => setUploadError(null), 3000);
    return null;
  }
};

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    setUploadError(null);

    try {
      let avatarUrl = values.avatarUrl;

      // Upload avatar if file is selected
      if (values.avatarFile) {
        const uploadedUrl = await handleImageUpload(values.avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      const response = await apiClient.post('/testimonials', {
        author: values.author,
        position: values.position,
        content: values.content,
        rating: values.rating,
        avatarUrl: avatarUrl || undefined,
      });
      
      if (response.data.success) {
        notifications.show({
          title: 'Thank you!',
          message: 'Your testimonial has been submitted for review.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        form.reset();
        // Refresh testimonials list
        fetchTestimonials();
      }
    } catch (err: any) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.error || 'Failed to submit testimonial',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clearAvatarFile = () => {
    form.setFieldValue('avatarFile', null);
    setUploadProgress(0);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box style={{ minHeight: '100vh', backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa' }}>
          <Container size="lg" py="xl">
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <Stack align="center" gap="md">
                <Loader size="lg" color={isDark ? 'white' : 'blue'} />
                <Text c="dimmed">Loading testimonials...</Text>
              </Stack>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <Box style={{ backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '120px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="md">
            <Title order={1} size="3rem" c="white" ta="center">
              What Our Clients Say
            </Title>
            <Text size="lg" c="white" ta="center" opacity={0.9} maw={600}>
              Real experiences from people who have worked with us
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Testimonials Grid */}
          {testimonials.length === 0 ? (
            <Paper p="xl" radius="md" withBorder style={{ textAlign: 'center', backgroundColor: isDark ? theme.colors.dark[6] : 'white' }}>
              <IconStar size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} style={{ marginBottom: 16 }} />
              <Title order={3} mb="xs" c={isDark ? 'white' : 'dark.9'}>No testimonials yet</Title>
              <Text c="dimmed">Be the first to share your experience!</Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {testimonials.map((t) => (
                <Card
                  key={t.id}
                  shadow="sm"
                  padding="xl"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                    position: 'relative',
                  }}
                >
                  <IconQuote
                    size={32}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      opacity: 0.1,
                      color: isDark ? 'white' : 'black',
                    }}
                  />
                  <Rating value={t.rating} readOnly mb="md" />
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6, minHeight: 100 }} mb="md">
                    &quot;{t.content}&quot;
                  </Text>
                  <Group gap="sm" mt="auto">
                    <Avatar 
                      src={t.avatarUrl} 
                      radius="xl" 
                      size="md" 
                      color="blue"
                    >
                      {!t.avatarUrl && t.author[0]}
                    </Avatar>
                    <Box>
                      <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'}>
                        {t.author}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {t.position}
                      </Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}

          {/* Submission Form */}
          <Divider
            my="xl"
            label="Share Your Experience"
            labelPosition="center"
            style={{ borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2] }}
          />

          <Paper
            radius="md"
            p="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                {/* Avatar Upload Section */}
                <div>
                  <Text size="sm" fw={500} mb={4} style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>
                    Your Avatar (Optional)
                  </Text>
                  <FileInput
                    placeholder="Upload an avatar image"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    leftSection={<IconUpload size={16} />}
                    value={form.values.avatarFile}
                    onChange={(file) => {
                      form.setFieldValue('avatarFile', file);
                      form.setFieldValue('avatarUrl', '');
                      setUploadError(null);
                    }}
                    disabled={submitting || !!form.values.avatarUrl}
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

                  {form.values.avatarFile && !uploadError && (
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
                          leftSection={<IconX size={14} />}
                        >
                          Remove
                        </Button>
                      </Group>
                      <Avatar
                        src={URL.createObjectURL(form.values.avatarFile)}
                        size={80}
                        radius={80}
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
                  label="Your Name"
                  placeholder="John Doe"
                  required
                  {...form.getInputProps('author')}
                  disabled={submitting}
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                      color: isDark ? 'white' : 'black',
                    },
                    label: { color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] },
                  }}
                />
                <TextInput
                  label="Your Position / Company"
                  placeholder="CEO at Company"
                  required
                  {...form.getInputProps('position')}
                  disabled={submitting}
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                      color: isDark ? 'white' : 'black',
                    },
                    label: { color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] },
                  }}
                />
                <Textarea
                  label="Your Testimonial"
                  placeholder="Tell us about your experience..."
                  minRows={4}
                  required
                  {...form.getInputProps('content')}
                  disabled={submitting}
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                      color: isDark ? 'white' : 'black',
                    },
                    label: { color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] },
                  }}
                />
                <div>
                  <Text size="sm" fw={500} mb={4} style={{ color: isDark ? theme.colors.gray[3] : theme.colors.dark[6] }}>
                    Rating
                  </Text>
                  <Rating
                    value={form.values.rating}
                    onChange={(value) => form.setFieldValue('rating', value)}
                    size="lg"
                  />
                </div>
                <Button
                  type="submit"
                  loading={submitting}
                  leftSection={<IconSend size={16} />}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                  fullWidth
                  mt="md"
                >
                  Submit Testimonial
                </Button>
                <Text size="xs" c="dimmed" ta="center">
                  Your testimonial will be reviewed by our team before being published.
                </Text>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Container>
      <Footer/>
    </Box>
  );
}