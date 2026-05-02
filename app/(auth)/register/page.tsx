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
  Progress,
  Group,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { 
  IconArrowLeft, 
  IconUserPlus, 
  IconAlertCircle, 
  IconCheck, 
  IconX,
  IconEyeCheck,
  IconLock,
  IconMail,
  IconUser
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const router = useRouter();
  
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

  // ✅ Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // ✅ Password validation rules
  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'red';
    if (passwordStrength <= 3) return 'yellow';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  // ✅ Form validation with detailed rules
  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validate: {
      // ✅ Full name validation
      fullName: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Full name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 50) {
          return 'Name must be less than 50 characters';
        }
        if (!/^[a-zA-Z\s\u1200-\u137F]+$/.test(value)) {
          return 'Name can only contain letters and spaces';
        }
        return null;
      },
      
      // ✅ Email validation with detailed checks
      email: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Email is required';
        }
        
        // Basic email format
        const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address (e.g., name@example.com)';
        }
        
        // Check for common typos in domains
        const domain = value.split('@')[1];
        if (domain) {
          const commonTypos: { [key: string]: string } = {
            'gmial.com': 'gmail.com',
            'gmail.co': 'gmail.com',
            'yahoo.co': 'yahoo.com',
            'hotnail.com': 'hotmail.com',
            'outlook.co': 'outlook.com',
          };
          
          if (commonTypos[domain]) {
            return `Did you mean ${value.split('@')[0]}@${commonTypos[domain]}?`;
          }
        }
        
        return null;
      },
      
      // ✅ Password validation
      password: (value) => {
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        if (value.length > 50) {
          return 'Password must be less than 50 characters';
        }
        if (!/[A-Z]/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(value)) {
          return 'Password must contain at least one number';
        }
        return null;
      },
      
      // ✅ Confirm password validation
      confirmPassword: (value, values) => {
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return null;
      },
      
      // ✅ Terms acceptance
      acceptTerms: (value) => {
        if (!value) {
          return 'You must accept the terms and conditions';
        }
        return null;
      },
    },
  });

  // ✅ Handle password change
  const handlePasswordChange = (value: string) => {
    form.setFieldValue('password', value);
    setPasswordStrength(checkPasswordStrength(value));
    if (value) {
      setShowPasswordRequirements(true);
    }
  };

  // ✅ Handle submit with additional validation
  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    
    // ✅ Additional password strength check
    if (passwordStrength < 2) {
      setError('Please choose a stronger password (Medium or Strong)');
      return;
    }
    
    // ✅ Check for suspicious email patterns
    const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const emailDomain = values.email.split('@')[1];
    if (suspiciousDomains.includes(emailDomain)) {
      setError('Temporary email addresses are not allowed. Please use a permanent email address.');
      return;
    }

    console.log('📝 Submitting registration for:', values.email);
    
    const result = await register({
      email: values.email,
      password: values.password,
      fullName: values.fullName.trim(),
    });
    
    console.log('📝 Registration result:', result);
    
    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
      // Clear sensitive fields on error
      form.setFieldValue('password', '');
      form.setFieldValue('confirmPassword', '');
      setPasswordStrength(0);
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

  const passwordRequirements = getPasswordRequirements(form.values.password);

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
      <Container size="sm" style={{ width: '100%' }}>
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
                Create Account
              </Title>
              <Text size="sm" c="dimmed">
                Join MsPortfolio to start managing your projects
              </Text>
            </Box>

            {error && (
              <Alert
                icon={<IconAlertCircle size={18} />}
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
                {/* Full Name Field */}
                <TextInput
                  required
                  label="Full Name"
                  placeholder="John Doe"
                  size="md"
                  leftSection={<IconUser size={18} />}
                  {...form.getInputProps('fullName')}
                  disabled={isLoading}
                  autoComplete="name"
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

                {/* Email Field */}
                <TextInput
                  required
                  label="Email Address"
                  placeholder="you@example.com"
                  size="md"
                  leftSection={<IconMail size={18} />}
                  {...form.getInputProps('email')}
                  disabled={isLoading}
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

                {/* Password Field */}
                <div>
                  <PasswordInput
                    required
                    label="Password"
                    placeholder="••••••••"
                    size="md"
                    leftSection={<IconLock size={18} />}
                    value={form.values.password}
                    onChange={(e) => handlePasswordChange(e.currentTarget.value)}
                    onBlur={() => form.validateField('password')}
                    disabled={isLoading}
                    autoComplete="new-password"
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
                  
                  {/* Password Strength Meter */}
                  {form.values.password && (
                    <Box mt="xs">
                      <Group justify="space-between" mb={4}>
                        <Text size="xs" c="dimmed">Password strength:</Text>
                        <Text size="xs" fw={600} c={getPasswordStrengthColor()}>
                          {getPasswordStrengthText()}
                        </Text>
                      </Group>
                      <Progress 
                        value={(passwordStrength / 5) * 100} 
                        color={getPasswordStrengthColor()} 
                        size="xs"
                      />
                      
                      {/* Password Requirements */}
                      <Stack gap={4} mt={8}>
                        <Group gap={4}>
                          {passwordRequirements.minLength ? 
                            <IconCheck size={12} color="green" /> : 
                            <IconX size={12} color="red" />
                          }
                          <Text size="xs" c={passwordRequirements.minLength ? 'green' : 'dimmed'}>
                            At least 6 characters
                          </Text>
                        </Group>
                        <Group gap={4}>
                          {passwordRequirements.hasUpperCase ? 
                            <IconCheck size={12} color="green" /> : 
                            <IconX size={12} color="red" />
                          }
                          <Text size="xs" c={passwordRequirements.hasUpperCase ? 'green' : 'dimmed'}>
                            At least one uppercase letter (A-Z)
                          </Text>
                        </Group>
                        <Group gap={4}>
                          {passwordRequirements.hasLowerCase ? 
                            <IconCheck size={12} color="green" /> : 
                            <IconX size={12} color="red" />
                          }
                          <Text size="xs" c={passwordRequirements.hasLowerCase ? 'green' : 'dimmed'}>
                            At least one lowercase letter (a-z)
                          </Text>
                        </Group>
                        <Group gap={4}>
                          {passwordRequirements.hasNumber ? 
                            <IconCheck size={12} color="green" /> : 
                            <IconX size={12} color="red" />
                          }
                          <Text size="xs" c={passwordRequirements.hasNumber ? 'green' : 'dimmed'}>
                            At least one number (0-9)
                          </Text>
                        </Group>
                      </Stack>
                    </Box>
                  )}
                </div>

                {/* Confirm Password Field */}
                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="••••••••"
                  size="md"
                  leftSection={<IconEyeCheck size={18} />}
                  {...form.getInputProps('confirmPassword')}
                  disabled={isLoading}
                  autoComplete="new-password"
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

                {/* Terms and Conditions */}
                <Checkbox
                  label={
                    <Text size="sm">
                      I accept the{' '}
                      <Anchor href="/terms" target="_blank" size="sm">
                        terms and conditions
                      </Anchor>
                    </Text>
                  }
                  {...form.getInputProps('acceptTerms', { type: 'checkbox' })}
                  disabled={isLoading}
                  styles={{
                    label: {
                      color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                    },
                  }}
                />

                {/* Submit Button */}
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
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
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
          &copy; {new Date().getFullYear()} MsPortfolio. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}