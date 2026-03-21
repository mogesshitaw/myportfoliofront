/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useParams } from 'next/navigation'
import { Container, Title, Text, Box } from '@mantine/core'
import { EditProjectForm } from './_components/edit-project-form'

import { useMantineTheme, useMantineColorScheme } from '@mantine/core'

export default function EditProjectPage() {
  const params = useParams()
  const id = params.id as string
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>
      
      <Container size="lg" py="xl">
        <EditProjectForm projectId={id} />
      </Container>
      
    </Box>
  )
}