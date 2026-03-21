import { Metadata } from "next"
import { 
  IconStar, 
  IconBriefcase,
  IconCheckbox,
  IconStack,
} from "@tabler/icons-react"
import { CreateProjectButton } from "./_components/create-project-button";
import { ProjectsList } from "./_components/projects-list";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  Stack,
  ThemeIcon,
} from "@mantine/core"

export const metadata: Metadata = {
  title: "Projects | DevPortfolio",
  description: "Manage your projects",
}

// ይህ በኋላ ከAPI ይምጣ ይሆናል
const stats = {
  total: 12,
  active: 8,
  completed: 4,
  technologies: 15
}

export default function ProjectsPage() {
  const statsCards = [
    {
      title: "Total Projects",
      value: stats.total,
      icon: IconBriefcase,
      color: "blue",
      bgColor: "blue",
    },
    {
      title: "Active",
      value: stats.active,
      icon: IconStar,
      color: "green",
      bgColor: "green",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: IconCheckbox,
      color: "grape",
      bgColor: "grape",
    },
    {
      title: "Technologies",
      value: stats.technologies,
      icon: IconStack,
      color: "pink",
      bgColor: "pink",
    },
  ]

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={1} size="h1">
              Projects
            </Title>
            <Text size="sm" c="dimmed" mt={4}>
              Showcase your work and manage client projects
            </Text>
          </div>
          <CreateProjectButton />
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {statsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Paper
                key={stat.title}
                p="md"
                radius="md"
                withBorder
                style={{
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                className="hover:shadow-md hover:-translate-y-0.5"
              >
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <Text size="xs" tt="uppercase" fw={600} c="dimmed">
                      {stat.title}
                    </Text>
                    <Title order={2} size="h2">
                      {stat.value}
                    </Title>
                  </Stack>
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color={stat.color}
                  >
                    <Icon size={20} />
                  </ThemeIcon>
                </Group>
              </Paper>
            )
          })}
        </SimpleGrid>

        {/* Projects List */}
        <ProjectsList />
      </Stack>
    </Container>
  )
}