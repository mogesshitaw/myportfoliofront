'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { theme } from '@/lib/mantine-theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AuthProvider>
          <Notifications />
          {children}
        </AuthProvider>
      </MantineProvider>
    </ThemeProvider>
  );
}