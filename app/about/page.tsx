/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Container, Title, Text, SimpleGrid, Card, Avatar, Group, Badge, Divider, ThemeIcon, Button, Stack, Box, useMantineTheme, useMantineColorScheme, ActionIcon } from '@mantine/core'
import { IconBriefcase, IconSchool, IconMapPin, IconMail, IconPhone, IconCode, IconStar, IconBrandGithub, IconBrandLinkedin, IconBrandTelegram, IconSend } from '@tabler/icons-react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'

export default function AboutPage() {
 const [mounted, setMounted] = useState(false)
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR and initial mount loading state
  if (!mounted) {
    return (
      <Box>
        <Navbar />
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

    const skills = [
    { name: 'React', level: '90%', color: '#61dafb' },
    { name: 'Next.js', level: '85%', color: '#000000' },
    { name: 'Node.js', level: '80%', color: '#68a063' },
    { name: 'TypeScript', level: '85%', color: '#3178c6' },
    { name: 'PHP', level: '88%', color: '#777bb4' },
    { name: 'MySQL', level: '85%', color: '#4479a1' },
    { name: 'JavaScript', level: '95%', color: '#f7df1e' },
    { name: 'HTML/CSS', level: '95%', color: '#e34c26' },
    { name: 'Git/GitHub', level: '90%', color: '#f1502f' },
    { name: 'MongoDB', level: '75%', color: '#47a248' },
  ]

  const experiences = [
    {
      title: 'Software Development Intern',
      company: 'POESSA',
      period: 'Jul 2024 - Sep 2024',
      description: 'Developed web applications using JavaScript and PHP, collaborated on internal tools, participated in code reviews, and contributed to agile development processes.',
    },
    {
      title: 'Freelance Web Developer',
      company: 'Self-Employed',
      period: '2023 - Present',
      description: 'Built responsive websites and web applications for clients, implemented modern UI/UX designs, and provided technical support and maintenance.',
    },
  ]

  const education = [
    {
      degree: 'BSc in Computer Science',
      institution: 'Mizan Tepi University',
      period: '2021 - 2025',
      gpa: '3.24',
      courses: 'Data Structures, Algorithms, Web Development, Database Systems, Software Engineering',
    },
  ]

  return (
    <Box style={{ 
      backgroundColor: isDark ? theme.colors.dark[7] : '#f8f9fa',
      minHeight: '100vh'
    }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '120px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Box style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Title
              order={1}
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '16px',
              }}
            >
              About Me
            </Title>
            <Text
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Get to know me, my journey, and what drives me as a developer
            </Text>
          </Box>
        </Container>

        {/* Decorative elements */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </Box>

      <Container size="lg" style={{ marginTop: '-40px', marginBottom: '60px' }}>
        <Stack gap="lg">
          {/* Profile Card */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Stack align="center" gap="md">
              <Avatar
                src="/images/about.jpg"
                size={150}
                radius={150}
                style={{ 
                  marginBottom: '16px', 
                  border: `4px solid ${isDark ? theme.colors.blue[7] : '#667eea'}` 
                }}
              />
              <Title 
                order={2} 
                size="h2" 
                c={isDark ? 'white' : 'dark.9'}
              >
                Moges Shitaw
              </Title>
              <Text c="blue.6" fw={500}>
                Full Stack Developer
              </Text>
              <Badge color="blue" variant="light" size="lg">
                🚀 3+ Years Experience
              </Badge>
              
              <Divider 
                style={{ 
                  width: '100%', 
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2] 
                }} 
              />
              
              <Box style={{ width: '100%' }}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Group gap="sm" c={isDark ? 'gray.3' : 'dark.6'}>
                    <IconMail size={18} color={isDark ? theme.colors.blue[5] : '#667eea'} />
                    <Text size="sm">mogesshitaw318@gmail.com</Text>
                  </Group>
                  <Group gap="sm" c={isDark ? 'gray.3' : 'dark.6'}>
                    <IconPhone size={18} color={isDark ? theme.colors.blue[5] : '#667eea'} />
                    <Text size="sm">+251 935 945 658</Text>
                  </Group>
                  <Group gap="sm" c={isDark ? 'gray.3' : 'dark.6'}>
                    <IconMapPin size={18} color={isDark ? theme.colors.blue[5] : '#667eea'} />
                    <Text size="sm">Addis Ababa, Ethiopia</Text>
                  </Group>
                  <Group gap="sm" c={isDark ? 'gray.3' : 'dark.6'}>
                    <IconSchool size={18} color={isDark ? theme.colors.blue[5] : '#667eea'} />
                    <Text size="sm">Mizan Tepi University</Text>
                  </Group>
                </SimpleGrid>
              </Box>

              {/* Social Links */}
              <Group gap="md" mt="md">
                <ActionIcon
                  component="a"
                  href="https://github.com/mogesshitaw"
                  target="_blank"
                  size="lg"
                  variant="subtle"
                  color={isDark ? 'gray.4' : 'dark.6'}
                >
                  <IconBrandGithub size={20} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://linkedin.com/in/moges-shitaw"
                  target="_blank"
                  size="lg"
                  variant="subtle"
                  color={isDark ? 'gray.4' : 'dark.6'}
                >
                  <IconBrandLinkedin size={20} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href="https://t.me/moges_shitaw"
                  target="_blank"
                  size="lg"
                  variant="subtle"
                  color={isDark ? 'gray.4' : 'dark.6'}
                >
                  <IconBrandTelegram size={20} />
                </ActionIcon>
              </Group>
            </Stack>
          </Card>

          {/* Who Am I Section */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Group gap="md" mb="lg">
              <ThemeIcon 
                size={50} 
                radius="lg" 
                variant="gradient" 
                gradient={{ from: '#667eea', to: '#764ba2' }}
              >
                <IconStar size={24} />
              </ThemeIcon>
              <Title order={2} size="h3" c={isDark ? 'white' : 'dark.9'}>
                Who Am I?
              </Title>
            </Group>
            
            <Text c={isDark ? 'gray.3' : 'dark.6'} style={{ lineHeight: 1.8, fontSize: '16px' }}>
              I&apos;m a passionate Full Stack Developer with expertise in modern web technologies. 
              I love creating elegant solutions to complex problems and building applications 
              that make a difference. My journey in software development started during my 
              university years at Mizan Tepi University, where I&apos;m currently pursuing my 
              BSc in Computer Science.
            </Text>
            
            <Text c={isDark ? 'gray.3' : 'dark.6'} style={{ lineHeight: 1.8, fontSize: '16px', marginTop: '16px' }}>
              I specialize in building full-stack web applications using React, Next.js, Node.js, 
              and various databases. I&apos;m passionate about creating responsive, user-friendly interfaces 
              and robust backend systems. I believe in writing clean, maintainable code and creating 
              user experiences that delight.
            </Text>
          </Card>

          {/* Experience Section */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Group gap="md" mb="lg">
              <ThemeIcon 
                size={50} 
                radius="lg" 
                variant="gradient" 
                gradient={{ from: '#667eea', to: '#764ba2' }}
              >
                <IconBriefcase size={24} />
              </ThemeIcon>
              <Title order={2} size="h3" c={isDark ? 'white' : 'dark.9'}>
                Experience
              </Title>
            </Group>

            <Stack gap="lg">
              {experiences.map((exp, index) => (
                <Box key={index}>
                  <Group justify="space-between" align="center" mb={4}>
                    <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                      {exp.title}
                    </Title>
                    <Badge size="lg" variant="light" color="blue">
                      {exp.period}
                    </Badge>
                  </Group>
                  <Text size="lg" fw={500} c="blue.6" mb="xs">
                    {exp.company}
                  </Text>
                  <Text c={isDark ? 'gray.3' : 'dark.6'}>
                    {exp.description}
                  </Text>
                  {index < experiences.length - 1 && (
                    <Divider mt="md" style={{ borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2] }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Card>

          {/* Education Section */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Group gap="md" mb="lg">
              <ThemeIcon 
                size={50} 
                radius="lg" 
                variant="gradient" 
                gradient={{ from: '#667eea', to: '#764ba2' }}
              >
                <IconSchool size={24} />
              </ThemeIcon>
              <Title order={2} size="h3" c={isDark ? 'white' : 'dark.9'}>
                Education
              </Title>
            </Group>

            {education.map((edu, index) => (
              <Box key={index}>
                <Group justify="space-between" align="center" mb={4}>
                  <Title order={3} size="h4" c={isDark ? 'white' : 'dark.9'}>
                    {edu.degree}
                  </Title>
                  <Badge size="lg" variant="light" color="blue">
                    {edu.period}
                  </Badge>
                </Group>
                <Text size="lg" fw={500} c="blue.6" mb="xs">
                  {edu.institution}
                </Text>
                <Badge color="blue" size="sm" mb="sm">GPA: {edu.gpa}</Badge>
                <Text size="sm" c={isDark ? 'gray.3' : 'dark.6'}>
                  {edu.courses}
                </Text>
              </Box>
            ))}
          </Card>

          {/* Skills */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <Group gap="md" mb="xl">
              <ThemeIcon 
                size={50} 
                radius="lg" 
                variant="gradient" 
                gradient={{ from: '#667eea', to: '#764ba2' }}
              >
                <IconCode size={24} />
              </ThemeIcon>
              <Title order={2} size="h3" c={isDark ? 'white' : 'dark.9'}>
                Skills & Technologies
              </Title>
            </Group>

            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
              {skills.map((skill) => (
                <Card
                  key={skill.name}
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[5] : '#f9fafb',
                    borderColor: isDark ? theme.colors.dark[3] : '#e5e7eb',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                  }}
                  className="hover:transform hover:-translate-y-1 hover:shadow-md"
                >
                  <Text size="lg" fw={600} c={isDark ? 'white' : 'dark.9'} mb={4}>
                    {skill.name}
                  </Text>
                  <Text size="sm" c="blue.6" fw={500}>
                    {skill.level}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Card>

          {/* Call to Action */}
          <Card
            shadow="md"
            radius="lg"
            padding="xl"
            withBorder
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textAlign: 'center',
            }}
          >
            <Title order={2} size="h3" c="white" mb="md">
              Let&apos;s Work Together
            </Title>
            <Text c="white" opacity={0.9} mb="xl" maw={500} mx="auto">
              Have a project in mind? I&apos;d love to help you bring it to life. Let&apos;s discuss your ideas!
            </Text>
            <Button
              component={Link}
              href="/contact"
              size="lg"
              variant="white"
              rightSection={<IconSend size={18} />}
              style={{
                color: '#667eea',
                fontWeight: 600,
              }}
            >
              Contact Me
            </Button>
          </Card>
        </Stack>
      </Container>
      <Footer/>
    </Box>
  )
}