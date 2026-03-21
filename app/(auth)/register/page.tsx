/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { IconArrowLeft, IconUserPlus, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => 
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    const result = await register({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    });
    
    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
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
            <Loader size="lg" color="white" />
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
                Create Account
              </Title>
              <Text size="sm" c="dimmed">
                Join DevPortfolio to start managing your projects
              </Text>
            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Registration Failed"
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
                  label="Full Name"
                  placeholder="John Doe"
                  size="md"
                  {...form.getInputProps('fullName')}
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

                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="••••••••"
                  size="md"
                  {...form.getInputProps('confirmPassword')}
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
                  leftSection={<IconUserPlus size={20} />}
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
                  Sign Up
                </Button>
              </Stack>
            </form>

            <Text size="sm" style={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Anchor
                component={Link}
                href="/login"
                fw={700}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                }}
              >
                Sign in
              </Anchor>
            </Text>
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