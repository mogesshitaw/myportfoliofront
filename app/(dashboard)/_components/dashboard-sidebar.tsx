/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconLayoutDashboard,
  IconFolder,
  IconMessage,
  IconUsers,
  IconSettings,
  IconHelp,
  IconLogout,
  IconChartBar,
  IconFileText,
  IconBell,
  IconX,
} from "@tabler/icons-react"
import {
  Box,
  NavLink,
  Stack,
  Avatar,
  Text,
  Group,
  ScrollArea,
  Divider,
  UnstyledButton,
  rem,
  useMantineTheme,
  useMantineColorScheme,
  Drawer,
} from "@mantine/core"

interface DashboardSidebarProps {
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { name: "Projects", href: "/projects", icon: IconFolder },
  { name: "Analytics", href: "/analytics", icon: IconChartBar },
  { name: "Messages", href: "/chat", icon: IconMessage },
  { name: "Users", href: "/users", icon: IconUsers },
  { name: "Direct Contact", href: "/contactadmin", icon: IconFileText },
  { name: "Notifications", href: "/notifications", icon: IconBell },
  { name: "Testimonials", href: "/testimonial", icon: IconFileText },
]

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: IconSettings },
  { name: "Help", href: "/help", icon: IconHelp },
]

// Sidebar Content Component
function SidebarContent({ onClose, isDark }: { onClose?: () => void; isDark: boolean }) {
  const pathname = usePathname()
  const theme = useMantineTheme()

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
    const Icon = item.icon

    return (
      <NavLink
        component={Link}
        href={item.href}
        label={item.name}
        leftSection={<Icon size={20} stroke={1.5} />}
        active={isActive}
        onClick={onClose}
        style={{
          borderRadius: rem(8),
          marginBottom: rem(4),
          backgroundColor: isActive 
            ? (isDark ? 'rgba(37, 99, 235, 0.2)' : theme.colors.blue[0])
            : 'transparent',
          color: isActive 
            ? (isDark ? theme.colors.blue[4] : theme.colors.blue[6])
            : (isDark ? theme.colors.gray[4] : theme.colors.gray[7]),
        }}
        styles={{
          root: {
            '&:hover': {
              backgroundColor: isActive 
                ? (isDark ? 'rgba(37, 99, 235, 0.25)' : theme.colors.blue[0])
                : (isDark ? theme.colors.dark[5] : theme.colors.gray[0]),
            },
          },
          label: {
            color: 'inherit',
          },
        }}
      />
    )
  }

  return (
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        color: isDark ? theme.colors.gray[3] : theme.colors.gray[8],
      }}
    >
      {/* Logo Section */}
      <Box mb="md" px="sm" pt="md">
        <Group justify="space-between" wrap="nowrap">
          <UnstyledButton component={Link} href="/dashboard" style={{ flex: 1 }}>
            <Group gap="xs" wrap="nowrap">
              <Box
                style={{
                  width: rem(40),
                  height: rem(40),
                  borderRadius: rem(10),
                  background: 'linear-gradient(135deg, #228be6, #7950f2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text c="white" fw={700} size="lg">MS</Text>
              </Box>
              <Text
                fw={800}
                size="lg"
                style={{
                  background: 'linear-gradient(135deg, #228be6, #7950f2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MsPortfolio
              </Text>
            </Group>
          </UnstyledButton>

          {/* Close Button - Only for mobile drawer */}
          {onClose && (
            <UnstyledButton
              onClick={onClose}
              style={{
                padding: rem(8),
                borderRadius: rem(8),
                color: isDark ? theme.colors.gray[4] : theme.colors.gray[6],
                '&:hover': {
                  backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                },
              }}
            >
              <IconX size={20} />
            </UnstyledButton>
          )}
        </Group>
      </Box>

      {/* Navigation */}
      <ScrollArea style={{ flex: 1 }} px="sm">
        <Stack gap={4}>
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </Stack>

        <Divider my="md" />

        <Stack gap={4}>
          {secondaryNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </Stack>
      </ScrollArea>

      {/* User Profile */}
      <Box pt="md" px="sm" pb="md" style={{ borderTop: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}` }}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Avatar size="md" radius="xl" color="blue">
              JD
            </Avatar>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'} truncate>
                John Doe
              </Text>
              <Text size="xs" c="dimmed" truncate>
                Administrator
              </Text>
            </Box>
          </Group>
          <UnstyledButton
            style={{
              color: theme.colors.red[6],
              padding: rem(8),
              borderRadius: rem(8),
              '&:hover': {
                backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
              },
            }}
          >
            <IconLogout size={18} stroke={1.5} />
          </UnstyledButton>
        </Group>
      </Box>
    </Box>
  )
}

export function DashboardSidebar({ isOpen, isMobile, onClose }: DashboardSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // For mobile: use Drawer
  if (isMobile) {
    return (
      <Drawer
        opened={isOpen}
        onClose={onClose}
        position="left"
        size="85%"
        padding={0}
        withCloseButton={false}
        styles={{
          body: {
            padding: 0,
            height: '100%',
          },
          content: {
            backgroundColor: isDark ? '#1a1b1e' : 'white',
          },
        }}
      >
        <SidebarContent onClose={onClose} isDark={isDark} />
      </Drawer>
    )
  }

  // For desktop: show regular sidebar
  return <SidebarContent isDark={isDark} />
}