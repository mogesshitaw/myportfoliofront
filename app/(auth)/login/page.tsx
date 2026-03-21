/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { IconArrowLeft, IconLogin, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password required' : null),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await login(values.email, values.password);
    } catch (err) {
      setError('Invalid email or password');
    }
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
            gap: '4px',
            color: 'white',
            marginBottom: '20px',
            opacity: 0.9,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
        >
          <IconArrowLeft size={16} />
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
              <Text size="sm" c="dimmed">
                Sign in to manage your projects
              </Text>
            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
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
                  label="Email"
                  placeholder="you@example.com"
                  size="md"
                  {...form.getInputProps('email')}
                  disabled={isLoading}
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                      color: isDark ? 'white' : 'black',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                    },
                    label: {
                      color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                    },
                  }}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="••••••••"
                  size="md"
                  {...form.getInputProps('password')}
                  disabled={isLoading}
                  styles={{
                    input: {
                      backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                      color: isDark ? 'white' : 'black',
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                    },
                    label: {
                      color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                    },
                  }}
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  leftSection={<IconLogin size={20} />}
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                  styles={{
                    root: {
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            <Text size="sm" style={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Anchor
                component={Link}
                href="/register"
                fw={700}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Create account
              </Anchor>
            </Text>

            <Paper
              p="sm"
              withBorder
              style={{
                backgroundColor: isDark 
                  ? 'rgba(102, 126, 234, 0.1)'
                  : 'rgba(102, 126, 234, 0.05)',
                borderColor: '#667eea',
              }}
            >
              <Text size="xs" c="dimmed" ta="center">
                Demo Credentials:
              </Text>
              <Text size="xs" ta="center">
                Email: demo@example.com
              </Text>
              <Text size="xs" ta="center">
                Password: demo123
              </Text>
            </Paper>
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
          &copy; {new Date().getFullYear()} DevPortfolio. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}