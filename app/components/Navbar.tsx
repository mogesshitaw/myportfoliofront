/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ChatModal from '@/components/chat/ChatModal';
 
 
import { 
  Container, 
  Group, 
  Title, 
  Button, 
  Burger, 
  Drawer, 
  Stack, 
  ActionIcon, 
  Avatar, 
  Menu,
  Badge,
  Box,
  Flex,
  Text,
  useMantineTheme,
  useMantineColorScheme,
  rem,
  Loader
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandTelegram, 
  IconSun, 
  IconMoon,
  IconLogin,
  IconDashboard,
  IconLogout,
  IconMessage,
  IconBriefcase,
  IconHome,
  IconInfoCircle,
  IconMail,
  IconCode,
  IconHelp ,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/', icon: IconHome },
  { name: 'Projects', href: '/myprojects', icon: IconCode },
  { name: 'Services', href: '/services', icon: IconBriefcase },
  { name: 'About', href: '/about', icon: IconInfoCircle },
  { name: 'Contact', href: '/contact', icon: IconMail },
  { name: 'FAQ' , href: '/faq' , icon:IconHelp },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [opened, { toggle, close }] = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications] = useState(3);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';
    const [chatModalOpened, setChatModalOpened] = useState(false);

  const isClient = user?.role === 'client';
  const isAdmin = user?.role === 'admin';
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Add CSS to body to account for fixed navbar
  useEffect(() => {
    if (mounted) {
      document.body.style.paddingTop = '70px';
      return () => {
        document.body.style.paddingTop = '0';
      };
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Container size="lg" h={70}>
          <Flex h="100%" align="center" justify="space-between">
            <Box component={Link} href="/" style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: rem(12),
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                }}
              />
              <Title order={3}>Moges Shitaw</Title>
            </Box>
            <Group gap="xs">
              <Loader size="sm" color="blue" />
            </Group>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          backgroundColor: isDark ? 'rgba(25, 25, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Container size="lg" h={70}>
          <Flex h="100%" align="center" justify="space-between">
            <Box component={Link} href="/" style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: rem(12),
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: rem(18) }}>MS</span>
              </Box>
              <Title order={3}>Ms Portfolios</Title>
            </Box>
            <Group gap="xs">
              <Loader size="sm" color={isDark ? 'white' : 'blue'} />
            </Group>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          transition: 'all 0.3s ease',
          backgroundColor: scrolled 
            ? isDark 
              ? 'rgba(25, 25, 35, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)'
            : isDark
              ? 'rgba(25, 25, 35, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled 
            ? `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`
            : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: scrolled 
            ? `0 4px 20px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'}`
            : 'none',
        }}
      >
        <Container size="lg" h={70}>
          <Flex h="100%" align="center" justify="space-between">
            {/* Logo */}
            <Box component={Link} href="/" style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: rem(12),
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                }}
              >
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: rem(18) }}>MS</span>
              </Box>
              <Text
                component="span"
                size="lg"
                fw={700}
                variant="gradient"
                gradient={{ from: 'blue', to: 'grape', deg: 135 }}
              >
                MS Portfolios
              </Text>
            </Box>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="md">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Box
                    key={item.name}
                    component={Link}
                    href={item.href}
                    style={{
                      fontSize: rem(14),
                      fontWeight: 500,
                      transition: 'color 0.2s ease',
                      color: isActive
                        ? theme.colors.blue[6]
                        : isDark 
                          ? theme.colors.gray[3] 
                          : theme.colors.gray[6],
                      display: 'flex',
                      alignItems: 'center',
                      gap: rem(4),
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.colors.blue[6];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive
                        ? theme.colors.blue[6]
                        : isDark 
                          ? theme.colors.gray[3] 
                          : theme.colors.gray[6];
                    }}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Box>
                );
              })}
            </Group>

            {/* Right Section */}
            <Group gap="xs">
              {/* Social Links */}
              <ActionIcon
                component="a"
                href="https://github.com/mogesshitaw"
                target="_blank"
                variant="subtle"
                size="lg"
                visibleFrom="md"
                color={isDark ? 'gray.3' : 'gray.6'}
              >
                <IconBrandGithub size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href="https://www.linkedin.com/in/moges-shitaw/"
                target="_blank"
                variant="subtle"
                size="lg"
                visibleFrom="md"
                color={isDark ? 'gray.3' : 'gray.6'}
              >
                <IconBrandLinkedin size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href="https://t.me/moges_shitaw"
                target="_blank"
                variant="subtle"
                size="lg"
                visibleFrom="md"
                color={isDark ? 'gray.3' : 'gray.6'}
              >
                <IconBrandTelegram size={20} />
              </ActionIcon>

              {/* Theme Toggle */}
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => toggleColorScheme()}
                color={isDark ? 'yellow' : 'gray.6'}
              >
                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>



              {/* User Menu / Login Button */}
              {user ? (
                <Menu position="bottom-end" offset={5}>
                  <Menu.Target>
                    <ActionIcon 
                      variant="subtle" 
                      size="lg" 
                      style={{ 
                        padding: 0,
                        border: `2px solid ${theme.colors.blue[6]}`,
                        borderRadius: '50%',
                      }}
                    >
                      <Avatar
                        radius="xl"
                        size="md"
                        color="blue"
                      >
                        {getUserInitials()}
                      </Avatar>
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown style={{ width: 240 }}>
                    <Menu.Label>
                      <Box>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {user?.fullName || 'User'}
                        </span>
                        <p style={{ fontSize: 12, color: 'gray', margin: 0 }}>{user?.email}</p>
                        <Badge size="xs" color="blue" mt={4}>
                          {user?.role || 'user'}
                        </Badge>
                      </Box>
                    </Menu.Label>
                    <Menu.Divider />
                    
                    {isClient && (
                       <Menu.Item
                                leftSection={<IconMessage size={16} />}
                                onClick={() => setChatModalOpened(true)}
                            >
                                Chat with Agent
                            </Menu.Item>
                    )}
                    
                    {isAdmin && (
                      <Menu.Item 
                        component={Link} 
                        href="/dashboard" 
                        leftSection={<IconDashboard size={16} />}
                      >
                        Dashboard
                      </Menu.Item>
                    )}
                    
                    <Menu.Divider />
                    
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={16} />}
                      onClick={logout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'grape', deg: 135 }}
                  size="sm"
                  onClick={handleLogin}
                  leftSection={<IconLogin size={16} />}
                  radius="xl"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Burger 
                opened={opened} 
                onClick={toggle} 
                hiddenFrom="md" 
                size="sm"
                color={isDark ? 'white' : 'black'}
              />
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer 
        opened={opened} 
        onClose={close} 
        position="right" 
        size="xs"
        padding="md"
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
        }}
      >
        <Stack gap="lg" pt="xl">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Box
                key={item.name}
                component={Link}
                href={item.href}
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(8),
                  fontSize: rem(16),
                  fontWeight: 500,
                  padding: rem(8),
                  borderRadius: rem(8),
                  transition: 'all 0.2s ease',
                  color: isActive
                    ? theme.colors.blue[6]
                    : isDark 
                      ? theme.colors.gray[2] 
                      : theme.colors.gray[7],
                  backgroundColor: isActive
                    ? isDark
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? isDark
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(59, 130, 246, 0.1)'
                    : 'transparent';
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Box>
            );
          })}
          
          {user && isClient && (
            <Box
              component={Link}
              href="/chat"
              onClick={close}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: rem(8),
                fontSize: rem(16),
                fontWeight: 500,
                padding: rem(8),
                borderRadius: rem(8),
                color: isDark ? theme.colors.gray[2] : theme.colors.gray[7],
                textDecoration: 'none',
              }}
            >
              <IconMessage size={20} />
              <span>Messages</span>
            </Box>
          )}
          
          {user && isAdmin && (
            <Box
              component={Link}
              href="/dashboard"
              onClick={close}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: rem(8),
                fontSize: rem(16),
                fontWeight: 500,
                padding: rem(8),
                borderRadius: rem(8),
                color: isDark ? theme.colors.gray[2] : theme.colors.gray[7],
                textDecoration: 'none',
              }}
            >
              <IconDashboard size={20} />
              <span>Dashboard</span>
            </Box>
          )}
        </Stack>
      </Drawer>
       <ChatModal 
                opened={chatModalOpened} 
                onClose={() => setChatModalOpened(false)} 
            />
    </>
  );
}