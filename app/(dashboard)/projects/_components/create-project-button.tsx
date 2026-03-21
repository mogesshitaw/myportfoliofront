"use client"

import { useState } from "react"
import { Button, Modal, useMantineTheme, useMantineColorScheme } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"
import { CreateProjectForm } from "./create-project-form"

export function CreateProjectButton() {
  const [opened, setOpened] = useState(false)
  
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        leftSection={<IconPlus size={16} />}
        variant="gradient"
        gradient={{ from: 'blue', to: 'grape', deg: 135 }}
        size="md"
      >
        New Project
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create New Project"
        size="xl"
        radius="md"
        centered
        styles={{
          content: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          header: {
            backgroundColor: isDark ? theme.colors.dark[8] : 'white',
          },
          title: {
            color: isDark ? 'white' : 'dark.9',
            fontWeight: 600,
            fontSize: theme.fontSizes.lg,
          },
        }}
      >
        <CreateProjectForm
          onSuccess={() => {
            console.log('Project created successfully!')
            setOpened(false)
          }}
        />
      </Modal>
    </>
  )
}