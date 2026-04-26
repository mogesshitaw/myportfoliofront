/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Button, 
  Group, 
  Title, 
  Text, 
  Paper, 
  SimpleGrid, 
  ThemeIcon, 
  Stack,
  Box,
  Badge,
  Avatar,
  Card,
  Image,
  Rating,
  useMantineColorScheme,
  useMantineTheme,
  Loader,
  ActionIcon,
  Center,
  Progress,
  Tooltip
} from '@mantine/core';
import { 
  IconArrowRight, 
  IconMessage, 
  IconFolder, 
  IconShield, 
  IconStar,
  IconCode,
  IconBrandGithub,
  IconExternalLink,
  IconBrandLinkedin,
  IconDeviceLaptop,
  IconMail,
  IconPlayerPlay,
  IconPlayerPause ,
  IconMapPin,
  IconCalendar,
  IconBrandTwitter,
  IconBrandFigma,
  IconBrandReact,
  IconBrandNodejs,
  IconDatabase,
  IconCloud,
  IconChevronRight,
  IconQuote,
  IconRocket,
  IconSparkles,
  IconArrowUp} from '@tabler/icons-react';
import Navbar from '@/app/components/Navbar';
import { useMediaQuery } from '@mantine/hooks';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  imageUrl?: string;
  status: string;
  progress: number;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };
  _count?: {
    likes: number;
    comments: number;
  };
}

interface Testimonial {
  id: string;
  author: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  project?: string;
  createdAt: string;
  isActive: boolean;
}

// Animation variants


export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { user } = useAuth();
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setMounted(true);
    fetchData();
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projectsResponse = await apiClient.get('/projects?featured=true&limit=6');
      if (projectsResponse.data.success) {
        setFeaturedProjects(projectsResponse.data.data);
      }
      
      const testimonialsResponse = await apiClient.get('/testimonials?active=true&limit=6');
      if (testimonialsResponse.data.success) {
        setTestimonials(testimonialsResponse.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      setError(error.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying, testimonials.length]);

    const handleTestimonialChange = (index: number) => {
    setCurrentTestimonialIndex(index);
    // Reset auto-play timer when manually changed
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      if (isAutoPlaying) {
        autoPlayRef.current = setInterval(() => {
          setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
      }
    }
  };

  // Add mounted state at the top of your component

useEffect(() => {
  setMounted(true);
}, []);

// Prevent Hydration mismatch
  if (!mounted) return null;
// Then update your loading section
if (loading) {
  return (
    <>
      <Navbar />
       <Box style={{ 
        minHeight: 'calc(100vh - 70px)', 
        backgroundColor: '#f8f9fa'  // Fixed color for SSR
      }}>
        <Center style={{ height: 'calc(100vh - 70px)' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="blue" />  {/* Fixed color, not using isDark */}
            <Text c="dimmed">Loading projects...</Text>
          </Stack>
        </Center>
      </Box>
    </>
  );
}
  // Personal info
  const personalInfo = {
    name: 'Moges Shitaw',
    title: 'Full Stack Developer',
    bio: 'I craft beautiful, responsive, and high-performance web applications.  I turn ideas into reality with clean code and modern design.',
    location: 'Addis Ababa, Ethiopia',
    email: 'mogesshitaw318@gmail.com',
    github: 'https://github.com/mogesshitaw',
    linkedin: 'https://linkedin.com/in/moges-shitaw',
    twitter: 'https://twitter.com/mogesshitaw',
    // experience: ' junior developer',
    projects: 0,
    technologies: '15+',
    happyClients: 0
  };

  const skills = [
     
    { name: 'React', level: 75, icon: IconBrandReact, color: '#61dafb' },
    { name: 'Next.js', level:70, icon: IconCode, color: '#000000' },
    { name: 'Node.js', level: 80, icon: IconBrandNodejs, color: '#68a063' },
    { name: 'TypeScript/Javascript', level: 75, icon: IconCode, color: '#3178c6' },
    { name: 'MySQL', level: 75, icon: IconDatabase, color: '#47a248' },
    { name: 'PostgreSQL', level: 80, icon: IconDatabase, color: '#336791' },
    { name: 'Tailwind CSS', level: 80, icon: IconCode, color: '#06b6d4' },
    { name: 'Bootstrap/HTML/CSS', level: 90, icon: IconCode, color: '#06b6d4' },
    { name: 'Prisma', level: 75, icon: IconDatabase, color: '#2d3748' },
    { name: 'C++', level: 75, icon: IconCode, color: '#00599C' },
    { name: 'Java', level: 70, icon: IconCode, color: '#007396' },  
    { name: 'PHP', level: 65, icon: IconCode, color: '#777BB4' },
    { name: 'Git/GitHub', level: 80, icon: IconBrandGithub, color: '#f34f29' },
   
  ];

  const services = [
    {
      icon: IconCode,
      title: 'Web Development',
      description: 'Custom web applications using React, Next.js, Node.js, and modern technologies.',
      link: '/services'
    },
    {
      icon: IconDeviceLaptop,
      title: 'Responsive Design',
      description: 'Mobile-first, responsive websites that look great on all devices.',
      link: '/services'
    },
    {
      icon: IconMessage,
      title: 'API Development',
      description: 'RESTful and GraphQL APIs with Node.js, Express, and Prisma.',
      link: '/services'
    },
    {
      icon: IconShield,
      title: 'Performance Optimization',
      description: 'Speed optimization, SEO, and best practices implementation.',
      link: '/services'
    },
    {
      icon: IconBrandReact,
      title: 'Frontend Development',
      description: 'Interactive UIs with React, Next.js, and modern frontend tools.',
      link: '/services'
    },
    {
      icon: IconDatabase,
      title: 'Database Design',
      description: 'Efficient database architecture with PostgreSQL, MongoDB, and Prisma.',
      link: '/services'
    }
  ];

  const stats = [
    // { value: personalInfo.experience, label: 'Years Experience', suffix: '+' },
    { value: featuredProjects.length, label: 'Projects Completed', suffix: '+' },
    { value: personalInfo.technologies, label: 'Technologies', suffix: '+' },
    { value: testimonials.length, label: 'Happy Clients', suffix: '+' }
  ];

  const formatProjectForDisplay = (project: Project) => ({
    title: project.title,
    description: project.description,
    image: project.imageUrl || 'https://placehold.co/600x400/1a1a2e/ffffff?text=Project',
    status: project.status === 'completed' ? 'Completed' : 
            project.status === 'in-progress' ? 'In Progress' : 'Active',
    tags: project.technologies?.slice(0, 3) || [],
    link: `/myprojects/${project.id}`
  });

  if (!mounted || loading) {
    return (
      <Box style={{ minHeight: '100vh', background: isDark ? '#0a0a0a' : '#f8f9fa' }}>
        <Navbar />
        <Center style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Stack align="center" gap="md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader size="lg" color={isDark ? 'white' : 'blue'} />
            </motion.div>
            <Text c="dimmed">Loading portfolio...</Text>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <Box style={{ background: isDark ? '#0a0a0a' : '#f8f9fa', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          transformOrigin: '0%',
          scaleX: scaleX,
          zIndex: 1000,
        }}
      />
      
      <Navbar />

      {/* Hero Section with Background Image */}
      <Box
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundImage: 'url(/images/herro.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay for better text readability */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark 
              ? 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)' 
              : 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Animated Background Particles */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </Box>

        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Stack align="center" gap="xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                  size="xl"
                  radius="xl"
                  style={{ padding: '12px 24px', fontSize: '1rem' }}
                >
                   Available for freelance work
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Title
                  order={1}
                  size={isMobile ? '2.5rem' : '4rem'}
                  ta="center"
                  lh={1.2}
                  style={{ maxWidth: '900px' }}
                >
                  <Text component="span" inherit style={{ color: 'white' }}>
                    Hi, I&apos;m
                  </Text>
                  <br />
                  <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                    inherit
                    style={{ fontWeight: 800 }}
                  >
                    Moges Shitaw
                  </Text>
                </Title>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Text
                  size="xl"
                  ta="center"
                  maw={700}
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {personalInfo.bio}
                </Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Group gap="md" wrap="wrap" justify="center">
                  <Group gap="xs">
                    <IconMapPin size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{personalInfo.location}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{personalInfo.email}</Text>
                  </Group>
                  {/* <Group gap="xs">
                    <IconCalendar size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>{personalInfo.experience}+ years experience</Text>
                  </Group> */}
                </Group>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Group justify="center" gap="md">
                  <Button
                    component={Link}
                    href="/login"
                    size="xl"
                    rightSection={<IconRocket size={20} />}
                    variant="gradient"
                    gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                    style={{ height: 52, paddingLeft: 32, paddingRight: 32 }}
                  >
                    Start Your Project
                  </Button>
                  <Button
                    component={Link}
                    href="/contact"
                    size="xl"
                    variant="outline"
                    color="white"
                    style={{ height: 52, paddingLeft: 32, paddingRight: 32, borderColor: 'white', color: 'white' }}
                  >
                    Contact Me
                  </Button>
                </Group>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Group gap="md">
                  <Tooltip label="GitHub">
                    <ActionIcon
                      component="a"
                      href={personalInfo.github}
                      target="_blank"
                      size="xl"
                      variant="subtle"
                      style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <IconBrandGithub size={24} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="LinkedIn">
                    <ActionIcon
                      component="a"
                      href={personalInfo.linkedin}
                      target="_blank"
                      size="xl"
                      variant="subtle"
                      style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <IconBrandLinkedin size={24} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Twitter">
                    <ActionIcon
                      component="a"
                      href={personalInfo.twitter}
                      target="_blank"
                      size="xl"
                      variant="subtle"
                      style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <IconBrandTwitter size={24} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconChevronRight size={24} style={{ transform: 'rotate(90deg)', opacity: 0.6, color: 'white' }} />
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section with Animation */}
      <Container size="lg" py={80}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Paper
                  p="xl"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                  }}
                  className="hover:shadow-xl hover:-translate-y-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Text size="3rem" fw={800} variant="gradient" gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}>
                      {stat.value}{stat.suffix}
                    </Text>
                  </motion.div>
                  <Text c="dimmed" size="sm" tt="uppercase" fw={600}>{stat.label}</Text>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>
        </motion.div>
      </Container>

      {/* Services Section */}
      <Box
        ref={servicesRef}
        py={80}
        style={{ backgroundColor: isDark ? theme.colors.dark[8] : 'white' }}
      >
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Stack align="center" gap="xl" mb={50}>
              <Badge size="lg" variant="gradient" gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }} radius="xl" style={{ padding: '8px 20px' }}>
                What I Do
              </Badge>
              <Title order={2} size="2.5rem" ta="center" c={isDark ? 'white' : 'dark.9'}>
                Services I Provide
              </Title>
              <Text size="lg" c="dimmed" ta="center" maw={600}>
                Helping you bring your ideas to life with modern technologies
              </Text>
            </Stack>
          </motion.div>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <Paper
                    p="xl"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                      transition: 'all 0.3s ease',
                      height: '100%',
                    }}
                    className="hover:shadow-xl"
                  >
                    <ThemeIcon
                      size={60}
                      radius="md"
                      variant="gradient"
                      gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
                      mb="md"
                    >
                      <Icon size={30} />
                    </ThemeIcon>
                    <Title order={3} size="h4" mb="xs" c={isDark ? 'white' : 'dark.9'}>
                      {service.title}
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                      {service.description}
                    </Text>
                    <Button
                      component={Link}
                      href="/services"
                      variant="subtle"
                      rightSection={<IconArrowRight size={16} />}
                      color={isDark ? 'gray.4' : 'dark.6'}
                      size="sm"
                    >
                      Read more
                    </Button>
                  </Paper>
                </motion.div>
              );
            })}
          </SimpleGrid>

          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/services"
              variant="light"
              rightSection={<IconArrowRight size={16} />}
            >
              View All Services
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Skills Section */}
      <Box
        ref={skillsRef}
        py={80}
        style={{ backgroundColor: isDark ? theme.colors.dark[9] : theme.colors.gray[0] }}
      >
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Stack align="center" gap="xl" mb={50}>
              <Badge size="lg" variant="gradient" gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }} radius="xl" style={{ padding: '8px 20px' }}>
                Technical Expertise
              </Badge>
              <Title order={2} size="2.5rem" ta="center" c={isDark ? 'white' : 'dark.9'}>
                My Skills
              </Title>
              <Text size="lg" c="dimmed" ta="center" maw={600}>
                Technologies and tools I work with
              </Text>
            </Stack>
          </motion.div>

          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Paper
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ThemeIcon size={50} radius="md" variant="light" color="blue" mb="sm">
                      <Icon size={28} />
                    </ThemeIcon>
                    <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'}>{skill.name}</Text>
                    {/* <Progress value={skill.level} size="sm" mt={8} />
                    <Text size="xs" c="dimmed" mt={4}>{skill.level}%</Text> */}
                  </Paper>
                </motion.div>
              );
            })}
          </SimpleGrid>

          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/about"
              variant="light"
              rightSection={<IconArrowRight size={16} />}
            >
              Learn More About Me
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Featured Projects Section */}
      <Box
        ref={projectsRef}
        py={80}
        style={{ backgroundColor: isDark ? theme.colors.dark[8] : 'white' }}
      >
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Stack gap="xl" mb={50}>
              <Group justify="space-between" align="center" wrap="wrap">
                <Box>
                  <Badge size="lg" variant="gradient" gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }} radius="xl" style={{ padding: '8px 20px' }}>
                    Portfolio
                  </Badge>
                  <Title order={2} size="2.5rem" mt="md" c={isDark ? 'white' : 'dark.9'}>
                    Featured Projects
                  </Title>
                  <Text size="lg" c="dimmed" mt="sm">
                    Some of my best work
                  </Text>
                </Box>
                <Button
                  component={Link}
                  href="/myprojects"
                  variant="subtle"
                  rightSection={<IconArrowRight size={16} />}
                >
                  View All Projects
                </Button>
              </Group>
            </Stack>
          </motion.div>

          {featuredProjects.length === 0 ? (
            <Center py={40}>
              <Stack align="center" gap="sm">
                <IconFolder size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} />
                <Text c="dimmed">No featured projects yet</Text>
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {featuredProjects.slice(0, 3).map((project, index) => {
                const formatted = formatProjectForDisplay(project);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                  >
                    <Card
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                        transition: 'all 0.3s ease',
                        height: '100%',
                      }}
                    >
                      <Card.Section>
                        <Image
                          src={formatted.image}
                          height={200}
                          alt={formatted.title}
                          style={{ objectFit: 'cover' }}
                        />
                      </Card.Section>
                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500} size="lg" c={isDark ? 'white' : 'dark.9'}>{formatted.title}</Text>
                        <Badge color={formatted.status === 'Completed' ? 'green' : 'blue'}>{formatted.status}</Badge>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2}>{formatted.description}</Text>
                      <Group gap="xs" mt="md">
                        {formatted.tags.map((tag) => (
                          <Badge key={tag} color="blue" variant="light" size="sm">{tag}</Badge>
                        ))}
                      </Group>
                      <Button
                        component={Link}
                        href={formatted.link}
                        variant="light"
                        fullWidth
                        mt="md"
                        rightSection={<IconExternalLink size={16} />}
                      >
                        View Project
                      </Button>
                    </Card>
                  </motion.div>
                );
              })}
            </SimpleGrid>
          )}

          {featuredProjects.length > 3 && (
            <Group justify="center" mt="xl">
              <Button
                component={Link}
                href="/myprojects"
                variant="light"
                rightSection={<IconArrowRight size={16} />}
              >
                Load More Projects
              </Button>
            </Group>
          )}
        </Container>
      </Box>

      {/* Testimonials Section with Carousel */}
     <Box
  ref={testimonialsRef}
  py={80}
  style={{ backgroundColor: isDark ? theme.colors.dark[9] : theme.colors.gray[0], overflow: 'hidden' }}
>
  <Container size="lg">
    {/* ርዕስ ክፍል */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Stack align="center" gap="xl" mb={50}>
        <Badge size="lg" variant="gradient" gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }} radius="xl" style={{ padding: '8px 20px' }}>
          Testimonials
        </Badge>
        <Title order={2} size="2.5rem" ta="center" c={isDark ? 'white' : 'dark.9'}>
          What Clients Say
        </Title>
        <Text size="lg" c="dimmed" ta="center" maw={600}>
          Feedback from people I've worked with
        </Text>
      </Stack>
    </motion.div>

    {testimonials.length === 0 ? (
      <Center py={40}>
        <Stack align="center" gap="sm">
          <IconStar size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} />
          <Text c="dimmed">No testimonials yet</Text>
        </Stack>
      </Center>
    ) : (
      <Box pos="relative">
        <Box
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '20px 0',
          }}
        >
          {/* Gradient Overlays */}
          <Box
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 100,
              background: `linear-gradient(to right, ${isDark ? theme.colors.dark[9] : theme.colors.gray[0]}, transparent)`,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 100,
              background: `linear-gradient(to left, ${isDark ? theme.colors.dark[9] : theme.colors.gray[0]}, transparent)`,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          {/* Animated Marquee - Now with Pause/Play support */}
          <motion.div
            animate={isAnimating ? {
              x: [0, - (testimonials.length * 380)],
            } : {
              x: 0
            }}
            transition={{
              duration: testimonials.length * 4,
              repeat: isAnimating ? Infinity : 0,
              ease: "linear",
              repeatType: "loop",
            }}
            style={{
              display: 'flex',
              gap: '24px',
              width: 'fit-content',
            }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                style={{ width: 350, flexShrink: 0 }}
              >
                <Paper
                  p="xl"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: isDark ? theme.colors.dark[7] : 'white',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:shadow-xl"
                >
                  <IconQuote
                    size={32}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      opacity: 0.1,
                      color: isDark ? 'white' : 'black',
                    }}
                  />
                  <Rating value={testimonial.rating} readOnly mb="md" />
                  <Text size="sm" c="dimmed" mb="xl" lineClamp={4} style={{ minHeight: 80 }}>
                    &quot;{testimonial.content.length > 120 ? `${testimonial.content.substring(0, 120)}...` : testimonial.content}&quot;
                  </Text>
                  <Group gap="sm">
                    <Avatar
                      src={testimonial.avatarUrl}
                      size="md"
                      radius="xl"
                      color="blue"
                    >
                      {testimonial.author[0]}
                    </Avatar>
                    <Box>
                      <Text fw={600} size="sm" c={isDark ? 'white' : 'dark.9'}>
                        {testimonial.author}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {testimonial.position} at {testimonial.company}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </motion.div>
        </Box>

        {/* Controls - Updated */}
        <Group justify="center" mt="xl" gap="md">
          <Button
            variant="light"
            onClick={() => {
              if (isAnimating) {
                // Pause
                setIsAnimating(false);
                setIsAutoPlaying(false);
                if (autoPlayRef.current) {
                  clearInterval(autoPlayRef.current);
                  autoPlayRef.current = null;
                }
              } else {
                // Play
                setIsAnimating(true);
                setIsAutoPlaying(true);
                autoPlayRef.current = setInterval(() => {
                  setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
                }, 5000);
              }
            }}
            size="sm"
            leftSection={isAnimating ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          >
            {isAnimating ? 'Pause' : 'Play'}
          </Button>
          
          <Group gap="xs">
            {testimonials.map((_, idx) => (
              <ActionIcon
                key={idx}
                size="sm"
                variant={currentTestimonialIndex === idx ? 'filled' : 'light'}
                onClick={() => {
                  // በእጅ ሲቀየር እንቅስቃሴውን አቁም
                  if (isAnimating) {
                    setIsAnimating(false);
                    setIsAutoPlaying(false);
                    if (autoPlayRef.current) {
                      clearInterval(autoPlayRef.current);
                      autoPlayRef.current = null;
                    }
                  }
                  setCurrentTestimonialIndex(idx);
                }}
              >
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: currentTestimonialIndex === idx 
                      ? (isDark ? 'white' : '#667eea')
                      : (isDark ? theme.colors.dark[4] : theme.colors.gray[4]),
                  }}
                />
              </ActionIcon>
            ))}
          </Group>
          <Text size="xs" c="dimmed">
            {currentTestimonialIndex + 1} / {testimonials.length}
          </Text>
        </Group>
      </Box>
    )}
     {testimonials.length === 0 ? (
          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/testimonials"
              variant="light"
              rightSection={<IconArrowRight size={16} />}
            >
              Share your Exprience
            </Button>
          </Group>
         ):(
          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/testimonials"
              variant="light"
              rightSection={<IconArrowRight size={16} />}
            >
              Read All Testimonials
            </Button>
          </Group>
         )}
  </Container>
</Box>


      {/* CTA Section */}
      <Box py={80} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
        <Container size="lg">
          <Stack align="center" gap="lg">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              viewport={{ once: true }}
            >
              <IconSparkles size={48} color="white" />
            </motion.div>
            <Title order={2} size="2.5rem" c="white" ta="center">
              Ready to Start Your Project?
            </Title>
            <Text size="xl" c="white" ta="center" maw={600} style={{ opacity: 0.9 }}>
              Let&apos;s work together to bring your ideas to life. I&apos;m available for freelance work.
            </Text>
            <Group gap="md">
              <Button
                component={Link}
                href="/login"
                size="xl"
                variant="white"
                rightSection={<IconRocket size={20} />}
                style={{ color: '#667eea' }}
              >
                Start Your Project
              </Button>
              <Button
                component={Link}
                href="/contact"
                size="xl"
                variant="outline"
                color="white"
                rightSection={<IconArrowRight size={20} />}
              >
                Contact Me
              </Button>
            </Group>
          </Stack>
        </Container>
        
        {/* Animated particles in CTA */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </Box>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
          >
            <ActionIcon
              size="xl"
              radius="xl"
              variant="gradient"
              gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
              onClick={scrollToTop}
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
            >
              <IconArrowUp size={24} />
            </ActionIcon>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </Box>
  );
}