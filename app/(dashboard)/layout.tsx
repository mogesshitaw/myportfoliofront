/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { AppShell } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { DashboardHeader } from './_components/dashboard-header'
import { DashboardSidebar } from './_components/dashboard-sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { useAuth } from '@/contexts/AuthContext'
import { Loader, Center, Stack, Text, Button, Paper, Title, Box } from '@mantine/core'
import { IconLock, IconArrowLeft, IconLogin } from '@tabler/icons-react'
import Link from 'next/link'

// Unauthorized Component
function UnauthorizedPage() {
  const router = useRouter()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Center style={{ 
      minHeight: '100vh',
      background: isDark ? theme.colors.dark[7] : '#f8f9fa'
    }}>
      <Paper
        radius="lg"
        p="xl"
        withBorder
        style={{
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          backgroundColor: isDark ? theme.colors.dark[6] : 'white',
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        }}
      >
        <Box
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <IconLock size={40} color="white" />
        </Box>

        <Title order={2} size="h2" mb="sm" c={isDark ? 'white' : 'dark.9'}>
          Unauthorized Access
        </Title>
        
        <Text c="dimmed" mb="lg">
          You don&apos;t have permission to access this page. This area is restricted to administrators only.
        </Text>

        <Button
          component={Link}
          href="/login"
          size="lg"
          leftSection={<IconLogin size={18} />}
          variant="gradient"
          gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
          fullWidth
        >
          Go to Login
        </Button>

        <Button
          component={Link}
          href="/"
          variant="subtle"
          size="sm"
          mt="md"
          leftSection={<IconArrowLeft size={16} />}
          color={isDark ? 'gray.4' : 'dark.6'}
        >
          Back to Home
        </Button>
      </Paper>
    </Center>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [opened, { toggle, close }] = useDisclosure()
  const [mounted, setMounted] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDark = colorScheme === 'dark'
  const { user, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication and redirect if not admin
  useEffect(() => {
    if (!mounted || isLoading) return
    
    // If user is not logged in or not admin, show unauthorized page
    if (!user || user.role !== 'admin') {
      setIsCheckingAuth(false)
    } else {
      setIsCheckingAuth(false)
    }
  }, [user, isLoading, mounted, router])

  // Close sidebar on mobile when path changes
  useEffect(() => {
    if (isMobile && opened) {
      close()
    }
  }, [pathname, isMobile, close, opened])

  // Show loading state during SSR or while checking auth
  if (!mounted || isLoading || isCheckingAuth) {
    return (
      <Center style={{ 
        minHeight: '100vh',
        background: isDark ? theme.colors.dark[7] : '#f8f9fa'
      }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={isDark ? 'white' : 'blue'} />
          <Text c="dimmed">Loading dashboard...</Text>
        </Stack>
      </Center>
    )
  }

  // If user is not admin, show unauthorized page
  if (!user || user.role !== 'admin') {
    return <UnauthorizedPage />
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: isDark ? theme.colors.dark[7] : '#F8F9FA',
          transition: 'background-color 0.3s ease',
        },
        navbar: {
          borderRight: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        },
        header: {
          borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        },
      }}
    >
      <AppShell.Header>
        <DashboardHeader 
          onMenuClick={toggle}
          isMobile={isMobile}
        />
      </AppShell.Header>

      <AppShell.Navbar p={0}>
        <DashboardSidebar 
          isOpen={opened} 
          isMobile={isMobile}
          onClose={close}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <div 
          style={{ 
            maxWidth: 1400, 
            margin: '0 auto', 
            padding: '24px',
          }}
        >
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}