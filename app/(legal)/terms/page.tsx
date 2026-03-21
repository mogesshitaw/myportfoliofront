/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Divider,
  List,
  ThemeIcon,
  Group,
  Alert,
  useMantineTheme,
  useMantineColorScheme,
  Center,
  Loader,
} from '@mantine/core';
import {
  IconFileText,
  IconScale,
  IconCopyright,
  IconExternalLink,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsOfServicePage() {
  const [mounted, setMounted] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

if (!mounted) {
    return (
      <>
        <Navbar />
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: '#f8f9fa'  // Fixed light color for SSR
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Loader size="lg" color="blue" />  {/* Fixed color */}
          </Center>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '100px',
          paddingBottom: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius={80} variant="white" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <IconFileText size={48} color="white" />
            </ThemeIcon>
            <Title order={1} size="3rem" c="white" ta="center">
              Terms of Service
            </Title>
            <Text size="lg" c="white" ta="center" opacity={0.9} maw={700}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[6] : 'white',
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          }}
        >
          <Stack gap="xl">
            {/* Introduction */}
            <Box>
              <Title order={2} size="h2" mb="md" c={isDark ? 'white' : 'dark.9'}>
                Agreement to Terms
              </Title>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                Welcome to Moges Shitaw&apos;s portfolio website. By accessing or using this website, you agree to be bound by 
                these Terms of Service. If you disagree with any part of the terms, you may not access the website.
              </Text>
            </Box>

            <Divider />

            {/* Intellectual Property */}
            <Box>
              <Group gap="sm" mb="md">
                <IconCopyright size={24} color={theme.colors.blue[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Intellectual Property Rights
                </Title>
              </Group>
              <Text c="dimmed" mb="md" style={{ lineHeight: 1.8 }}>
                The website and its original content, features, and functionality are owned by Moges Shitaw and are protected 
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </Text>
              <List
                spacing="md"
                icon={
                  <ThemeIcon color="blue" size={20} radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
                c="dimmed"
              >
                <List.Item>You may view, download for caching purposes only, and print pages for personal use</List.Item>
                <List.Item>You must not republish, sell, rent, or sub-license material from the website</List.Item>
                <List.Item>You must not reproduce, duplicate, copy, or redistribute content without permission</List.Item>
              </List>
            </Box>

            <Divider />

            {/* User Representations */}
            <Box>
              <Group gap="sm" mb="md">
                <IconScale size={24} color={theme.colors.green[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  User Representations
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                By using the website, you represent and warrant that:
              </Text>
              <List
                spacing="md"
                mt="md"
                icon={
                  <ThemeIcon color="green" size={20} radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
                c="dimmed"
              >
                <List.Item>You have the legal capacity and agree to comply with these Terms</List.Item>
                <List.Item>You are not a minor in the jurisdiction in which you reside</List.Item>
                <List.Item>You will not access the website through automated or non-human means</List.Item>
                <List.Item>You will not use the website for any illegal or unauthorized purpose</List.Item>
              </List>
            </Box>

            <Divider />

            {/* Prohibited Activities */}
            <Box>
              <Group gap="sm" mb="md">
                <IconAlertCircle size={24} color={theme.colors.red[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Prohibited Activities
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                You may not access or use the website for any purpose other than that for which we make the website available. 
                Prohibited activities include:
              </Text>
              <List
                spacing="md"
                mt="md"
                icon={
                  <ThemeIcon color="red" size={20} radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
                c="dimmed"
              >
                <List.Item>Systematically retrieving data to create a collection or database</List.Item>
                <List.Item>Tricking, defrauding, or misleading other users</List.Item>
                <List.Item>Interfering with, disrupting, or creating an undue burden on the website</List.Item>
                <List.Item>Attempting to impersonate another user or person</List.Item>
                <List.Item>Using the website for any unauthorized commercial purpose</List.Item>
              </List>
            </Box>

            <Divider />

            {/* Limitation of Liability */}
            <Box>
              <Group gap="sm" mb="md">
                <IconAlertCircle size={24} color={theme.colors.orange[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Limitation of Liability
                </Title>
              </Group>
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Disclaimer"
                color="orange"
                variant="light"
                mb="md"
              >
                In no event shall Moges Shitaw be liable for any indirect, punitive, incidental, special, or consequential damages 
                arising out of or in any way connected with your use of the website.
              </Alert>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                We do not warrant that the website will be uninterrupted, secure, or error-free. We may remove the website 
                for indefinite periods of time or cancel the service at any time without notice.
              </Text>
            </Box>

            <Divider />

            {/* Third-Party Links */}
            <Box>
              <Group gap="sm" mb="md">
                <IconExternalLink size={24} color={theme.colors.grape[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Third-Party Links
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                The website may contain links to third-party websites or services that are not owned or controlled by me. 
                I have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
              </Text>
            </Box>

            <Divider />

            {/* Termination */}
            <Box>
              <Group gap="sm" mb="md">
                <IconFileText size={24} color={theme.colors.blue[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Termination
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, 
                including without limitation if you breach the Terms.
              </Text>
            </Box>

            <Divider />

            {/* Governing Law */}
            <Box>
              <Group gap="sm" mb="md">
                <IconScale size={24} color={theme.colors.violet[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Governing Law
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                These Terms shall be governed and construed in accordance with the laws of Ethiopia, without regard to its conflict of law provisions.
              </Text>
            </Box>

            <Divider />

            {/* Changes to Terms */}
            <Box>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access 
                or use our website after those revisions become effective, you agree to be bound by the revised terms.
              </Text>
            </Box>

            <Divider />

            {/* Contact Us */}
            <Box>
              <Title order={2} size="h2" mb="md" c={isDark ? 'white' : 'dark.9'}>
                Contact Us
              </Title>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                If you have any questions about these Terms, please contact me:
              </Text>
              <Paper p="md" mt="md" style={{ background: isDark ? theme.colors.dark[5] : theme.colors.gray[0] }}>
                <Text c={isDark ? 'white' : 'dark.9'}>
                  <strong>Moges Shitaw</strong><br />
                  Email: mogesshitaw318@gmail.com<br />
                  Location: Addis Ababa, Ethiopia
                </Text>
              </Paper>
            </Box>

            <Divider />

            {/* Acknowledgment */}
            <Box>
              <Alert
                icon={<IconFileText size={16} />}
                title="Acknowledgment"
                color="blue"
                variant="light"
              >
                By using this website, you acknowledge that you have read these Terms of Service and agree to be bound by them.
              </Alert>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}