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

export function DashboardSidebar({ isOpen, isMobile, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Show a simplified version during SSR
  if (!mounted) {
    return (
      <Box
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        <Box mb="md" px="sm">
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xs">
              <Box
                style={{
                  width: rem(32),
                  height: rem(32),
                  borderRadius: rem(8),
                  background: 'linear-gradient(135deg, #228be6, #7950f2)',
                }}
              />
              <Text fw={700} size="lg">DevPortfolio</Text>
            </Group>
          </Group>
        </Box>
      </Box>
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
      {/* Logo */}
      <Box mb="md" px="sm">
        <Group justify="space-between" wrap="nowrap">
          <UnstyledButton component={Link} href="/dashboard">
            <Group gap="xs">
              <Box
                style={{
                  width: rem(32),
                  height: rem(32),
                  borderRadius: rem(8),
                  background: 'linear-gradient(135deg, #228be6, #7950f2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text c="white" fw={700} size="lg">MS</Text>
              </Box>
              <Text
                fw={700}
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
        </Group>
      </Box>

      {/* Navigation */}
      <ScrollArea style={{ flex: 1 }} px="sm">
        <Stack gap={4}>
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </Stack>

        <Divider 
          my="md" 
          style={{
            borderColor: isDark ? theme.colors.dark[5] : theme.colors.gray[2],
          }}
        />

        <Stack gap={4}>
          {secondaryNavigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </Stack>
      </ScrollArea>

      {/* User Profile */}
      <Box 
        pt="md" 
        px="sm"
        style={{
          borderTop: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Avatar
              src="https://github.com/shadcn.png"
              size="md"
              radius="xl"
              style={{
                border: `2px solid ${isDark ? theme.colors.blue[8] : theme.colors.blue[5]}`,
              }}
            />
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>
                John Doe
              </Text>
              <Text size="xs" c={isDark ? 'gray.5' : 'dimmed'}>
                Admin
              </Text>
            </Box>
          </Group>
          <UnstyledButton
            style={{
              color: theme.colors.red[6],
              padding: rem(8),
              borderRadius: rem(8),
              transition: 'background-color 0.2s',
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