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
  Anchor,
  useMantineTheme,
  useMantineColorScheme,
  Center,
  Loader,
} from '@mantine/core';
import {
  IconShield,
  IconLock,
  IconDatabase,
  IconCookie,
  IconMail,
  IconDeviceLaptop,
  IconGlobe,
  IconCheck,
} from '@tabler/icons-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicyPage() {
  const [mounted, setMounted] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
              <IconShield size={48} color="white" />
            </ThemeIcon>
            <Title order={1} size="3rem" c="white" ta="center">
              Privacy Policy
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
                Introduction
              </Title>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                Welcome to Moges Shitaw&apos;s portfolio website. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. 
                If you do not agree with the terms of this privacy policy, please do not access the site.
              </Text>
            </Box>

            <Divider />

            {/* Information We Collect */}
            <Box>
              <Group gap="sm" mb="md">
                <IconDatabase size={24} color={theme.colors.blue[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Information We Collect
                </Title>
              </Group>
              <Text c="dimmed" mb="md" style={{ lineHeight: 1.8 }}>
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
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
                <List.Item>
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>Personal Data:</Text>
                  <Text size="sm" c="dimmed">Name, email address, and other information you voluntarily provide when contacting me.</Text>
                </List.Item>
                <List.Item>
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>Usage Data:</Text>
                  <Text size="sm" c="dimmed">Information automatically collected when you visit the site, such as IP address, browser type, pages visited.</Text>
                </List.Item>
                <List.Item>
                  <Text fw={600} c={isDark ? 'white' : 'dark.9'}>Device Information:</Text>
                  <Text size="sm" c="dimmed">Information about your device, including hardware model, operating system, and unique device identifiers.</Text>
                </List.Item>
              </List>
            </Box>

            <Divider />

            {/* How We Use Your Information */}
            <Box>
              <Group gap="sm" mb="md">
                <IconDeviceLaptop size={24} color={theme.colors.green[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  How We Use Your Information
                </Title>
              </Group>
              <Text c="dimmed" mb="md" style={{ lineHeight: 1.8 }}>
                We may use the information we collect from you for various purposes, including:
              </Text>
              <List
                spacing="md"
                icon={
                  <ThemeIcon color="green" size={20} radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
                c="dimmed"
              >
                <List.Item>To respond to your inquiries and provide customer support</List.Item>
                <List.Item>To send you updates about my work and services (with your consent)</List.Item>
                <List.Item>To improve and optimize the website</List.Item>
                <List.Item>To analyze usage patterns and trends</List.Item>
                <List.Item>To protect against unauthorized access or illegal activity</List.Item>
              </List>
            </Box>

            <Divider />

            {/* Cookies and Tracking */}
            <Box>
              <Group gap="sm" mb="md">
                <IconCookie size={24} color={theme.colors.orange[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Cookies and Tracking Technologies
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                We may use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the 
                Site and improve your experience. Most browsers are set to accept cookies by default. You can set your 
                browser to remove or reject cookies, but this may affect certain features of the Site.
              </Text>
            </Box>

            <Divider />

            {/* Data Security */}
            <Box>
              <Group gap="sm" mb="md">
                <IconLock size={24} color={theme.colors.red[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Data Security
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
              </Text>
            </Box>

            <Divider />

            {/* Your Rights */}
            <Box>
              <Group gap="sm" mb="md">
                <IconGlobe size={24} color={theme.colors.grape[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Your Rights
                </Title>
              </Group>
              <Text c="dimmed" mb="md" style={{ lineHeight: 1.8 }}>
                Depending on your location, you may have certain rights regarding your personal information:
              </Text>
              <List
                spacing="md"
                icon={
                  <ThemeIcon color="grape" size={20} radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
                c="dimmed"
              >
                <List.Item>The right to access and receive a copy of your personal data</List.Item>
                <List.Item>The right to request correction of inaccurate data</List.Item>
                <List.Item>The right to request deletion of your personal data</List.Item>
                <List.Item>The right to withdraw consent at any time</List.Item>
              </List>
            </Box>

            <Divider />

            {/* Contact Information */}
            <Box>
              <Group gap="sm" mb="md">
                <IconMail size={24} color={theme.colors.blue[6]} />
                <Title order={2} size="h2" c={isDark ? 'white' : 'dark.9'}>
                  Contact Information
                </Title>
              </Group>
              <Text c="dimmed" style={{ lineHeight: 1.8 }}>
                If you have questions or comments about this Privacy Policy, please contact me at:
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

            {/* Updates to Policy */}
            <Box>
              <Text size="sm" c="dimmed" ta="center">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                <br />
                This policy is effective as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </Text>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}