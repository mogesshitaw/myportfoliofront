/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { 
  Container, 
  SimpleGrid, 
  Text, 
  Group, 
  ActionIcon, 
  Box, 
  Divider, 
  Stack,
  Title,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandTwitter, 
  IconBrandTelegram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconArrowUp,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/myprojects' },
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ]
  },
  {
    title: 'Services',
    links: [
      { name: 'Web Development', href: '/services#web' },
      { name: 'Frontend Development', href: '/services#frontend' },
      { name: 'Backend Development', href: '/services#backend' },
      { name: 'UI/UX Design', href: '/services#design' },
      { name: 'API Development', href: '/services#api' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ]
  }
];

const contactInfo = [
  { icon: IconMail, text: 'mogesshitaw7702@gmail.com', href: 'mailto:mogesshitaw7702@gmail.com' },
  { icon: IconPhone, text: '+251 935 945 658', href: 'tel:+251935945658' },
  { icon: IconMapPin, text: 'Addis Ababa, Ethiopia', href: 'https://maps.google.com/?q=Addis+Ababa,+Ethiopia' },
];

const socialLinks = [
  { icon: IconBrandGithub, href: 'https://github.com/mogesshitaw', label: 'GitHub', color: '#333' },
  { icon: IconBrandLinkedin, href: 'https://linkedin.com/in/moges-shitaw', label: 'LinkedIn', color: '#0077b5' },
  { icon: IconBrandTwitter, href: 'https://twitter.com/mogesshitaw', label: 'Twitter', color: '#1DA1F2' },
  { icon: IconBrandTelegram, href: 'https://t.me/moges_shitaw', label: 'Telegram', color: '#0088cc' },
];

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    // SSR and initial mount loading state
    if (!mounted) {
      return (
        <Box>
          <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Container size="lg" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="animate-pulse">Loading...</div>
              </div>
            </Container>
          </Box>
        </Box>
      )
    }
  

  return (
    <Box
      component="footer"
      style={{
        backgroundColor: isDark ? theme.colors.dark[8] : '#1a1a2e',
        borderTop: `1px solid ${isDark ? theme.colors.dark[5] : 'rgba(255,255,255,0.1)'}`,
        position: 'relative',
      }}
    >
      {/* Decorative Gradient Line */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
        }}
      />

      <Container size="lg" py={60}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
          {/* Brand Section */}
          <Box>
            <Group gap="xs" mb="md">
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
              <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={48}
                    height={48}
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
              
              <Text
                size="xl"
                fw={700}
                variant="gradient"
                gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
              >
                Moges Shitaw
              </Text>
            </Group>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6, marginBottom: 20 }}>
              Full Stack Developer passionate about creating beautiful, responsive, 
              and high-performance web applications that solve real-world problems.
            </Text>
            
            {/* Social Links */}
            <Group gap="sm" mt="md">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <ActionIcon
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    size="lg"
                    radius="xl"
                    variant="light"
                    style={{
                      backgroundColor: isDark ? theme.colors.dark[6] : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                    className="hover:scale-110 hover:shadow-lg"
                  >
                    <Icon size={18} />
                  </ActionIcon>
                );
              })}
            </Group>
          </Box>

          {/* Quick Links Sections */}
          {footerLinks.map((section) => (
            <Box key={section.title}>
              <Title order={4} size="sm" c={isDark ? 'white' : 'gray.3'} mb="md" fw={600}>
                {section.title}
              </Title>
              <Stack gap="xs">
                {section.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      color: isDark ? theme.colors.gray[5] : '#9ca3af',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'inline-block',
                    }}
                    className="hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Divider 
          my={40} 
          style={{ 
            borderColor: isDark ? theme.colors.dark[5] : 'rgba(255,255,255,0.1)' 
          }} 
        />

        {/* Contact Info and Copyright */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Group gap="xl" wrap="wrap">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <Group key={item.text} gap="xs" wrap="nowrap">
                  <Icon size={16} color={isDark ? theme.colors.gray[5] : '#9ca3af'} />
                  <Text
                    component="a"
                    href={item.href}
                    size="sm"
                    c="dimmed"
                    style={{
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    className="hover:text-blue-400"
                  >
                    {item.text}
                  </Text>
                </Group>
              );
            })}
          </Group>

          <Group justify="flex-end" gap="md">
            <Text size="xs" c="dimmed">
              © {new Date().getFullYear()} Moges Shitaw. All rights reserved.
            </Text>
            <ActionIcon
              variant="subtle"
              size="md"
              onClick={scrollToTop}
              style={{
                color: isDark ? theme.colors.gray[5] : '#9ca3af',
                transition: 'all 0.3s ease',
              }}
              className="hover:scale-110 hover:text-blue-400"
            >
              <IconArrowUp size={18} />
            </ActionIcon>
          </Group>
        </SimpleGrid>

      </Container>
    </Box>
  );
}