/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Group, Button, Badge, Box, useMantineTheme, useMantineColorScheme } from '@mantine/core'
import { 
  IconCode, 
  IconApi, 
  IconCloud, 
  IconBrandReact, 
  IconBrandNodejs, 
  IconBrandPhp,
  IconCheck,
  IconSend,
  IconDeviceDesktop,
  IconDatabase,
  IconShield,
  IconRocket
} from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'

const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies like React, Next.js, and Node.js.',
    icon: IconCode,
    color: '#667eea',
    features: [
      'Custom website development',
      'E-commerce solutions',
      'Content management systems',
      'Progressive web apps (PWA)',
      'API integration',
    ],
  },
  {
    title: 'Frontend Development',
    description: 'Beautiful and interactive user interfaces using React, Next.js, and modern CSS frameworks.',
    icon: IconBrandReact,
    color: '#61dafb',
    features: [
      'React/Next.js applications',
      'Responsive web design',
      'UI/UX implementation',
      'Component libraries',
      'Performance optimization',
    ],
  },
  {
    title: 'Backend Development',
    description: 'Robust server-side applications and APIs using Node.js, Express, PHP, and various databases.',
    icon: IconBrandNodejs,
    color: '#68a063',
    features: [
      'RESTful API development',
      // 'GraphQL APIs',
      'Database design',
      'Authentication systems',
      'Server management',
    ],
  },
  {
    title: 'Full Stack Development',
    description: 'End-to-end development from frontend to backend. Complete web applications with authentication.',
    icon: IconApi,
    color: '#764ba2',
    features: [
      'MERN/MEAN stack',
      // 'LAMP stack',
      // 'JAMstack architecture',
      'Serverless applications',
      'Cloud integration',
    ],
  },
  {
    title: 'PHP Development',
    description: 'Dynamic websites and web applications using PHP and MySQL. Custom CMS development.',
    icon: IconBrandPhp,
    color: '#777bb4',
    features: [
      'Custom PHP applications',
      // 'WordPress development',
      'Laravel applications',
      'CMS customization',
      'Legacy system support',
    ],
  },
  {
    title: 'Cloud & Deployment',
    description: 'Application deployment and hosting solutions. CI/CD setup, cloud services integration.',
    icon: IconCloud,
    color: '#f39c12',
    features: [
      'CI/CD pipeline setup',
      'Cloud deployment',
      'Domain configuration',
      // 'SSL certificates',
      'Performance monitoring',
    ],
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design that creates beautiful and intuitive experiences for your users.',
    icon: IconDeviceDesktop,
    color: '#e74c3c',
    features: [
      'Wireframing & prototyping',
      'User research',
      'Responsive design',
      'Design systems',
      'Usability testing',
    ],
  },
  {
    title: 'Database Design',
    description: 'Efficient and scalable database solutions for your applications.',
    icon: IconDatabase,
    color: '#3498db',
    features: [
      'Schema design',
      'Query optimization',
      'Data modeling',
      'Migration strategies',
      'Backup & recovery',
    ],
  },
  {
    title: 'Security & Optimization',
    description: 'Keep your applications secure and performant with best practices.',
    icon: IconShield,
    color: '#2ecc71',
    features: [
      'Security audits',
      'Performance tuning',
      'Code optimization',
      'Caching strategies',
      'Vulnerability fixes',
    ],
  },
]

export  function ServicesContent() {
   const router = useRouter()
   const [mounted, setMounted] = useState(false)
   const theme = useMantineTheme()
   const { colorScheme } = useMantineColorScheme()
   const isDark = colorScheme === 'dark'
 
   useEffect(() => {
     setMounted(true)
   }, [])
 
   if (!mounted) {
     return (
       <Box style={{ minHeight: '100vh' }}>
         <Navbar />
         <Container size="lg" style={{ marginTop: '-40px', marginBottom: '60px' }}>
           <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
             {services.map((service, index) => {
               const Icon = service.icon
               return (
                 <Card
                   key={index}
                   shadow="md"
                   radius="lg"
                   padding="xl"
                   withBorder
                   style={{
                     backgroundColor: 'white',
                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   }}
                 >
                   <ThemeIcon
                     size={60}
                     radius="lg"
                     variant="gradient"
                     gradient={{ from: service.color, to: service.color }}
                     style={{ marginBottom: '16px' }}
                   >
                     <Icon size={30} />
                   </ThemeIcon>
 
                   <Title order={3} size="h4" mb="xs" c="dark.9">
                     {service.title}
                   </Title>
 
                   <Text size="sm" c="dimmed" mb="lg" style={{ lineHeight: 1.6 }}>
                     {service.description}
                   </Text>
 
                   <Box mb="lg">
                     {service.features.map((feature, i) => (
                       <Group key={i} gap="xs" mb="xs" c="dark.6">
                         <IconCheck size={14} color="#10b981" />
                         <Text size="sm">{feature}</Text>
                       </Group>
                     ))}
                   </Box>
 
                   <Button
                     variant="light"
                     fullWidth
                     rightSection={<IconSend size={16} />}
                     style={{
                       backgroundColor: `${service.color}10`,
                       color: service.color,
                       border: 'none',
                     }}
                     onClick={() => router.push('/contact')}
                   >
                     Get Started
                   </Button>
                 </Card>
               )
             })}
           </SimpleGrid>
         </Container>
       </Box>
     )
   }

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
              What I Offer
            </Title>
             <Badge
              size="lg"
              variant="white"
              style={{ 
                marginBottom: '20px', 
                padding: '8px 20px', 
                fontSize: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
                My Services
            </Badge>
            <Text
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '700px',
                margin: '0 auto',
              }}
            >
              I offer a wide range of development services to help bring your ideas to life
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
        {/* Services Grid */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                shadow="md"
                radius="lg"
                padding="xl"
                withBorder
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                className="hover:transform hover:-translate-y-1 hover:shadow-xl"
              >
                <ThemeIcon
                  size={60}
                  radius="lg"
                  variant="gradient"
                  gradient={{ from: service.color, to: service.color }}
                  style={{ marginBottom: '16px' }}
                >
                  <Icon size={30} />
                </ThemeIcon>

                <Title order={3} size="h4" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                  {service.title}
                </Title>

                <Text size="sm" c="dimmed" mb="lg" style={{ lineHeight: 1.6 }}>
                  {service.description}
                </Text>

                <Box mb="lg">
                  {service.features.map((feature, i) => (
                    <Group key={i} gap="xs" mb="xs" c={isDark ? 'gray.3' : 'dark.6'}>
                      <IconCheck size={14} color="#10b981" />
                      <Text size="sm">{feature}</Text>
                    </Group>
                  ))}
                </Box>

                <Button
                  variant="light"
                  fullWidth
                  rightSection={<IconSend size={16} />}
                  style={{
                    backgroundColor: isDark ? `${service.color}20` : `${service.color}10`,
                    color: service.color,
                    border: 'none',
                  }}
                  onClick={() => router.push('/contact')}
                >
                  Get Started
                </Button>
              </Card>
            )
          })}
        </SimpleGrid>

        {/* Why Choose Me Section */}
        <Card
          shadow="md"
          radius="lg"
          padding="xl"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.dark[6] : 'white',
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            marginTop: '40px',
            marginBottom: '30px',
          }}
        >
          <Title order={2} size="h3" ta="center" mb="xl" c={isDark ? 'white' : 'dark.9'}>
            Why Choose Me?
          </Title>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
            {[
              {
                icon: IconRocket,
                title: 'Fast Delivery',
                description: 'I deliver high-quality work on time, every time.',
              },
              {
                icon: IconCode,
                title: 'Clean Code',
                description: 'I write maintainable, scalable, and well-documented code.',
              },
              {
                icon: IconShield,
                title: '100% Satisfaction',
                description: 'Your satisfaction is my top priority.',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <Box key={index} style={{ textAlign: 'center' }}>
                  <ThemeIcon
                    size={70}
                    radius={70}
                    variant="gradient"
                    gradient={{ from: '#667eea', to: '#764ba2' }}
                    style={{ margin: '0 auto 16px' }}
                  >
                    <Icon size={30} />
                  </ThemeIcon>
                  <Title order={4} size="h5" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                    {item.title}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>
                </Box>
              )
            })}
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
            Ready to Start Your Project?
          </Title>
          <Text c="white" opacity={0.9} mb="xl" maw={500} mx="auto">
            Let&apos;s work together to bring your ideas to life. Get in touch today for a free consultation!
          </Text>
          <Button
            onClick={() => router.push('/contact')}
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
      </Container>
      <Footer/>
    </Box>
  )
}