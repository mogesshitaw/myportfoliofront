/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TextInput,
  Textarea,
  Checkbox,
  Button,
  Stack,
  Title,
  Text,
  Box,
  Paper,
  Group,
  LoadingOverlay,
  Select,
  FileInput,
  Image,
  Progress,
  Alert,
  NumberInput,
  Badge,
  useMantineTheme,
  useMantineColorScheme,
  Center,
  Loader,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { 
  IconArrowLeft, 
  IconDeviceFloppy, 
  IconBrandGithub, 
  IconExternalLink,
  IconUpload,
  IconX,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react'
import apiClient from '@/lib/api'

// Interface for upload response
interface UploadResponse {
  success: boolean;
  imageUrl: string;
  provider: 'cloudinary' | 'local';
  publicId?: string;
}

interface EditProjectFormProps {
  projectId: string
  onSuccess?: () => void
}

export function EditProjectForm({ projectId, onSuccess }: EditProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      technologies: "",
      imageFile: null as File | null,
      imageUrl: "",
      featured: false,
      detailedDescription: "",
      domainName: "",
      liveUrl: "",
      githubUrl: "",
      status: "active",
      progress: 0,
    },
    validate: {
      title: (value) => (value.length < 3 ? "Title must be at least 3 characters" : null),
      description: (value) => (value.length < 10 ? "Description must be at least 10 characters" : null),
      technologies: (value) => (value.length < 2 ? "Please enter at least one technology" : null),
      liveUrl: (value) => {
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          return "Please enter a valid URL"
        }
        return null
      },
      githubUrl: (value) => {
        if (value && !/^https?:\/\/github\.com\/.+/.test(value)) {
          return "Please enter a valid GitHub URL"
        }
        return null
      },
      progress: (value) => {
        if (value < 0 || value > 100) {
          return "Progress must be between 0 and 100"
        }
        return null
      },
    },
  })

  // Upload Method Indicator Component
  const UploadMethodIndicator = () => {
    const [uploadMethod, setUploadMethod] = useState<string>('loading');
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      const checkUploadMethod = async () => {
        try {
          const response = await apiClient.get('/upload/config');
          if (response.data.success) {
            setUploadMethod(response.data.config.provider);
            setError(null);
          } else {
            setUploadMethod('local');
          }
        } catch (error: any) {
          console.log('Upload config endpoint not available, using local storage');
          setUploadMethod('local');
          setError(null);
        }
      };
      
      checkUploadMethod();
    }, []);
    
    if (uploadMethod === 'loading') {
      return (
        <Group gap="xs" mb="md">
          <Text size="sm" c="dimmed">Upload Method:</Text>
          <Badge color="gray" variant="light">
            <Group gap={4}>
              <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span>Checking...</span>
            </Group>
          </Badge>
        </Group>
      );
    }
    
    return (
      <Group gap="xs" mb="md">
        <Text size="sm" c="dimmed">Upload Method:</Text>
        <Badge 
          color={uploadMethod === 'cloudinary' ? 'grape' : 'blue'}
          variant="light"
          size="md"
        >
          {uploadMethod === 'cloudinary' ? '☁️ Cloudinary CDN' : '💾 Local Storage'}
        </Badge>
        {uploadMethod === 'cloudinary' && (
          <Text size="xs" c="dimmed">
            (Automatic optimization & CDN delivery)
          </Text>
        )}
        {uploadMethod === 'local' && (
          <Text size="xs" c="dimmed">
            (Images saved on server)
          </Text>
        )}
      </Group>
    );
  };

  // Fetch project data
  useEffect(() => {
    fetchProjectData()
  }, [projectId])

  const fetchProjectData = async () => {
    setIsFetching(true)
    try {
      const response = await apiClient.get(`/projects/${projectId}`)
      if (response.data.success) {
        const project = response.data.data
        
        // Set form values
        form.setValues({
          title: project.title || "",
          description: project.description || "",
          technologies: project.technologies?.join(', ') || "",
          imageUrl: project.imageUrl || "",
          featured: project.featured || false,
          detailedDescription: project.detailedDescription || "",
          domainName: project.domainName || "",
          liveUrl: project.liveUrl || "",
          githubUrl: project.githubUrl || "",
          status: project.status || "active",
          progress: project.progress || 0,
        })
      }
    } catch (error: any) {
      console.error('Failed to fetch project:', error)
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to load project data",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPEG, PNG, and WEBP images are allowed');
      notifications.show({
        title: 'Invalid File',
        message: 'Only JPEG, PNG, and WEBP images are allowed',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      notifications.show({
        title: 'File Too Large',
        message: 'Image size must be less than 5MB',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      return null;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadProgress(0);
      
      const response = await apiClient.post<UploadResponse>("/upload/project-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (response.data.success) {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        
        // Show which provider was used
        const providerMessage = response.data.provider === 'cloudinary' 
          ? 'Uploaded to Cloudinary CDN' 
          : 'Saved locally';
        
        notifications.show({
          title: 'Success',
          message: `Image uploaded successfully! ${providerMessage}`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        
        // Store provider info if needed for deletion
        if (response.data.provider === 'cloudinary' && response.data.publicId) {
          localStorage.setItem(`img_${response.data.publicId}`, response.data.publicId);
        }
        
        return response.data.imageUrl;
      }
      
      return null;
    } catch (error: any) {
      console.error("Image upload failed:", error);
      const errorMsg = error.response?.data?.error || "Failed to upload image";
      setUploadError(errorMsg);
      
      notifications.show({
        title: 'Upload Failed',
        message: errorMsg,
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
      
      setTimeout(() => setUploadError(null), 3000);
      return null;
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true)
    setUploadError(null)

    try {
      let imageUrl = values.imageUrl

      // Upload image if file is selected
      if (values.imageFile) {
        const uploadedUrl = await handleImageUpload(values.imageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          throw new Error("Image upload failed")
        }
      }

      const response = await apiClient.put(`/projects/${projectId}`, {
        title: values.title,
        description: values.description,
        detailedDescription: values.detailedDescription || undefined,
        technologies: values.technologies.split(",").map((t: string) => t.trim()),
        domainName: values.domainName || undefined,
        liveUrl: values.liveUrl || undefined,
        githubUrl: values.githubUrl || undefined,
        imageUrl: imageUrl || undefined,
        featured: values.featured,
        status: values.status,
        progress: values.progress,
      })

      if (response.data.success) {
        notifications.show({
          title: "Success!",
          message: "Project updated successfully.",
          color: "green",
          icon: <IconCheck size={16} />,
        })
        
        if (onSuccess) onSuccess()
        router.refresh()
      }
    } catch (error: any) {
      console.error("Failed to update project:", error)
      notifications.show({
        title: "Error",
        message: error.response?.data?.error || "Failed to update project",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearImageFile = () => {
    form.setFieldValue("imageFile", null)
    setUploadProgress(0)
    setUploadError(null)
  }

  const removeCurrentImage = () => {
    form.setFieldValue("imageUrl", "")
  }

  if (isFetching) {
    return (
      <Box style={{ 
        minHeight: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={isDark ? 'white' : 'blue'} />
          <Text c="dimmed">Loading project data...</Text>
        </Stack>
      </Box>
    )
  }

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />
      
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
          <Stack gap="xl">
            {/* Header */}
            <Group justify="space-between">
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => router.back()}
                size="sm"
                color={isDark ? 'gray.4' : 'dark.6'}
              >
                Back
              </Button>
              <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                Edit Project
              </Title>
              <Box w={70} />
            </Group>

            {/* Basic Information */}
            <Stack gap="md">
              <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                Basic Information
              </Title>
              
              <TextInput
                required
                label="Project Title"
                placeholder="E-commerce Website"
                {...form.getInputProps('title')}
                disabled={isLoading}
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

              <UploadMethodIndicator />

              <Textarea
                required
                label="Description"
                placeholder="Brief description of your project..."
                minRows={3}
                {...form.getInputProps('description')}
                disabled={isLoading}
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
                label="Technologies"
                placeholder="React, Node.js, MongoDB"
                description="Separate technologies with commas"
                {...form.getInputProps('technologies')}
                disabled={isLoading}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                  label: {
                    color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  },
                  description: {
                    color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                  },
                }}
              />
            </Stack>

            {/* Project Image Upload */}
            <Stack gap="md">
              <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                Project Image
              </Title>
              
              {/* Current Image Preview */}
              {form.values.imageUrl && !form.values.imageFile && (
                <Box>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.6'}>
                      Current Image:
                    </Text>
                    <Button
                      variant="subtle"
                      color="red"
                      size="xs"
                      onClick={removeCurrentImage}
                      leftSection={<IconX size={14} />}
                    >
                      Remove
                    </Button>
                  </Group>
                  <Image
                    src={form.values.imageUrl}
                    alt="Current"
                    radius="md"
                    height={200}
                    fit="cover"
                    style={{ border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}
                  />
                </Box>
              )}

              <FileInput
                label="Upload New Image"
                placeholder="Click to upload"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                leftSection={<IconUpload size={16} />}
                value={form.values.imageFile}
                onChange={(file) => {
                  form.setFieldValue("imageFile", file)
                  setUploadError(null)
                }}
                disabled={isLoading}
                clearable
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
                <Box>
                  <Group justify="space-between" mb={4}>
                    <Text size="xs" c="dimmed">Uploading...</Text>
                    <Text size="xs" c="dimmed">{uploadProgress}%</Text>
                  </Group>
                  <Progress value={uploadProgress} size="sm" color="blue" />
                </Box>
              )}

              {form.values.imageFile && (
                <Box>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.6'}>
                      New Image Preview:
                    </Text>
                    <Button
                      variant="subtle"
                      color="red"
                      size="xs"
                      onClick={clearImageFile}
                      leftSection={<IconX size={14} />}
                    >
                      Remove
                    </Button>
                  </Group>
                  <Image
                    src={URL.createObjectURL(form.values.imageFile)}
                    alt="Preview"
                    radius="md"
                    height={200}
                    fit="cover"
                    style={{ border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` }}
                  />
                </Box>
              )}

              {uploadError && (
                <Alert color="red" title="Upload Error" variant="light">
                  {uploadError}
                </Alert>
              )}
            </Stack>

            {/* Featured Option */}
            <Checkbox
              label="Feature this project on homepage"
              {...form.getInputProps('featured', { type: 'checkbox' })}
              styles={{
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />

            {/* Status and Progress */}
            <Group grow>
              <Select
                label="Status"
                placeholder="Select status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'planning', label: 'Planning' },
                ]}
                {...form.getInputProps('status')}
                disabled={isLoading}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                  label: {
                    color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
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

              <NumberInput
                label="Progress (%)"
                placeholder="0-100"
                min={0}
                max={100}
                {...form.getInputProps('progress')}
                disabled={isLoading}
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
            </Group>

            {/* Detailed Description */}
            <Stack gap="md">
              <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                Detailed Description
              </Title>
              
              <Textarea
                label="Detailed Description"
                placeholder="Write a detailed description of your project..."
                minRows={6}
                description="You can use Markdown for formatting"
                {...form.getInputProps('detailedDescription')}
                disabled={isLoading}
                styles={{
                  input: {
                    backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                    color: isDark ? 'white' : 'black',
                  },
                  label: {
                    color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                  },
                  description: {
                    color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
                  },
                }}
              />
            </Stack>

            {/* Project URLs */}
            <Stack gap="md">
              <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                Project URLs
              </Title>
              
              <Group grow>
                <TextInput
                  label="Domain Name"
                  placeholder="myapp.com"
                  {...form.getInputProps('domainName')}
                  leftSection={<IconExternalLink size={16} />}
                  disabled={isLoading}
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
                  label="Live Demo URL"
                  placeholder="https://myapp.com"
                  type="url"
                  {...form.getInputProps('liveUrl')}
                  leftSection={<IconExternalLink size={16} />}
                  disabled={isLoading}
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
              </Group>

              <TextInput
                label="GitHub Repository"
                placeholder="https://github.com/username/repo"
                type="url"
                {...form.getInputProps('githubUrl')}
                leftSection={<IconBrandGithub size={16} />}
                disabled={isLoading}
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
            </Stack>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isLoading}
              leftSection={<IconDeviceFloppy size={20} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'grape', deg: 135 }}
            >
              Update Project
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}