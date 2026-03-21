'use client'

import { TextInput, Title, Box, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

export function ChatHeader() {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Box
      p="md"
      style={{
        borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        backgroundColor: isDark ? theme.colors.dark[7] : 'white',
      }}
    >
      <Title 
        order={3} 
        size="h4" 
        mb="md"
        c={isDark ? 'white' : 'dark.9'}
      >
        Messages
      </Title>
      
      <TextInput
        placeholder="Search conversations..."
        leftSection={<IconSearch size={16} />}
        styles={{
          input: {
            backgroundColor: isDark ? theme.colors.dark[6] : 'white',
            color: isDark ? 'white' : 'black',
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            '&:focus': {
              borderColor: theme.colors.blue[6],
            },
          },
          section: {
            color: isDark ? theme.colors.gray[5] : theme.colors.gray[6],
          },
        }}
      />
    </Box>
  )
}