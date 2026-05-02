/* eslint-disable @typescript-eslint/no-explicit-any */
// app/login/page.tsx - የተሻሻለው ክፍል

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Anchor,
  Box,
  Alert,
  Loader,
  Center,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconLogin, IconAlertCircle, IconMail, IconLock } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
    
    // Check if already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email address';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (isSubmitting) return;
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await login(values.email, values.password);
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
        // Focus on email field on error
        form.setFieldError('email', '');
        form.setFieldError('password', '');
      }
      // On success, the AuthContext will handle redirect
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Login submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo credentials (for testing only - remove in production)
  const fillDemoCredentials = () => {
    form.setValues({
      email: 'client@example.com',
      password: 'password123',
    });
  };

  // Show loading state during SSR and initial mount
  if (!mounted) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Container size="xs" style={{ width: '100%' }}>
          <Center style={{ minHeight: 400 }}>
            <Stack align="center" gap="md">
              <Loader size="lg" color="white" />
              <Text c="white">Loading...</Text>
            </Stack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container size="xs" style={{ width: '100%' }}>
        <Anchor
          component={Link}
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'white',
            marginBottom: '20px',
            opacity: 0.9,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
        >
          <IconArrowLeft size={18} />
          <Text size="sm">Back to Home</Text>
        </Anchor>

        <Paper
          radius="lg"
          p="xl"
          withBorder
          style={{
            backgroundColor: isDark 
              ? 'rgba(30, 30, 46, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          }}
        >
          <Stack gap="lg">
            <Box style={{ textAlign: 'center' }}>
              <Title
                order={2}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2rem',
                  marginBottom: '8px',
                }}
              >
                Welcome Back
              </Title>

            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={18} />}
                title="Login Failed"
                color="red"
                variant="light"
                withCloseButton
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  required
                  label="Email Address"
                  placeholder="you@example.com"
                  size="md"
                  leftSection={<IconMail size={18} />}
                  {...form.getInputProps('email')}
                  disabled={isLoading || isSubmitting}
                  autoComplete="email"
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                      color: isDark ? 'white' : 'black',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                      '&:focus': {
                        borderColor: '#667eea',
                      },
                    },
                    label: {
                      color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                      fontWeight: 500,
                    },
                  }}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="••••••••"
                  size="md"
                  leftSection={<IconLock size={18} />}
                  {...form.getInputProps('password')}
                  disabled={isLoading || isSubmitting}
                  autoComplete="current-password"
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                      color: isDark ? 'white' : 'black',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                      '&:focus': {
                        borderColor: '#667eea',
                      },
                    },
                    label: {
                      color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                      fontWeight: 500,
                    },
                  }}
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading || isSubmitting}
                  leftSection={<IconLogin size={20} />}
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                  styles={{
                    root: {
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                >
                  {isLoading || isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <Text size="sm" style={{ textAlign: 'center',
              color:"black"
            }}>
              Don&apos;t have an account?{' '}
              <Anchor
                component={Link}
                href="/register"
                fw={700}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Create account
              </Anchor>
            </Text>

            {/* Demo credentials (remove in production) */}
            {/* {process.env.NODE_ENV === 'development' && (
              <Paper
                p="sm"
                withBorder
                style={{
                  backgroundColor: isDark 
                    ? 'rgba(102, 126, 234, 0.1)'
                    : 'rgba(102, 126, 234, 0.05)',
                  borderColor: '#667eea',
                  cursor: 'pointer',
                }}
                onClick={fillDemoCredentials}
              >
                <Text size="xs" c="dimmed" ta="center">
                  📝 Demo Credentials (Click to fill)
                </Text>
                <Text size="xs" ta="center">
                  Email: client@example.com
                </Text>
                <Text size="xs" ta="center">
                  Password: password123
                </Text>
              </Paper>
            )} */}
          </Stack>
        </Paper>

        <Text 
          size="xs" 
          style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            color: 'rgba(255, 255, 255, 0.7)' 
          }}
        >
          &copy; {new Date().getFullYear()} MsPortfolio. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}