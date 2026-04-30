/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Text,
  Paper,
  Grid,
  Group,
  TextInput,
  Textarea,
  Button,
  ActionIcon,
  Box,
  SimpleGrid,
  Card,
  ThemeIcon,
  rem,
  useMantineTheme,
  useMantineColorScheme,
  Select,
  Checkbox,
  Stack,
  Divider,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMediaQuery } from '@mantine/hooks'
import { 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandTelegram,
  IconBrandTwitter,
  IconSend,
  IconClock,
  IconCheck,
  IconX,
  IconMessage,
  IconUser,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import Navbar from '@/app/components/Navbar'
import Footer from '../components/Footer'
import apiClient from '@/lib/api'

const contactInfo = [
  {
    icon: IconMail,
    title: 'Email',
    value: 'mogesshitaw7702@gmail.com',
    link: 'mailto:mogesshitaw7702@gmail.com',
    color: 'blue',
  },
  {
    icon: IconPhone,
    title: 'Phone',
    value: '+251 935 945 658',
    link: 'tel:+251935945658',
    color: 'green',
  },
  {
    icon: IconMapPin,
    title: 'Location',
    value: 'Addis Ababa, Ethiopia',
    link: 'https://maps.google.com/?q=Addis+Ababa,+Ethiopia',
    color: 'red',
  },
  {
    icon: IconClock,
    title: 'Working Hours',
    value: 'Mon - Fri, 9:00 AM - 6:00 PM',
    color: 'violet',
  },
]

const socialLinks = [
  { icon: IconBrandGithub, href: 'https://github.com/mogesshitaw', label: 'GitHub', color: '#333' },
  { icon: IconBrandLinkedin, href: 'https://www.linkedin.com/in/moges-shitaw/', label: 'LinkedIn', color: '#0077b5' },
  { icon: IconBrandTelegram, href: 'https://t.me/moges_shitaw', label: 'Telegram', color: '#0088cc' },
  { icon: IconBrandTwitter, href: 'https://twitter.com/mogesshitaw', label: 'Twitter', color: '#1DA1F2' },
  { icon: IconBrandWhatsapp, href: 'https://wa.me/251 935 945 658', label: 'WhatsApp', color: '#25D366' },
]

const faqs = [
  {
    question: 'What services do you offer?',//  mobile app development, 
    answer: 'I offer full-stack web development,UI/UX design, and consulting services.',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary. A simple website might take 2-4 weeks, while complex applications can take 2-6 months.',
  },
  {
    question: 'What is your development process?',
    answer: 'I follow an agile methodology with regular updates, clear milestones, and continuous communication.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer: 'Yes, I offer maintenance and support packages to ensure your project runs smoothly after launch.',
  },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  
 const [mounted, setMounted] = useState(false)
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])



  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      service: '',
      message: '',
      agree: false,
    },
    validate: {
      name: (value: string) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      subject: (value: string) => (value.length < 5 ? 'Subject must be at least 5 characters' : null),
      message: (value: string) => (value.length < 10 ? 'Message must be at least 10 characters' : null),
      agree: (value: any) => (value ? null : 'You must agree to the terms'),
    },
  })


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
  const handleSubmit = async (values: typeof form.values) => {
  setLoading(true)
  try {
    const response = await apiClient.post('/contacts', {
      name: values.name,
      email: values.email,
      subject: values.subject,
      service: values.service,
      message: values.message,
      agree: values.agree
    })

    if (response.data.success) {
      notifications.show({
        title: 'Success!',
        message: response.data.message,
        color: 'green',
        icon: <IconCheck size={16} />,
      })
      
      form.reset()
    }
  } catch (error: any) {
    notifications.show({
      title: 'Error',
      message: error.response?.data?.error || 'Failed to send message. Please try again.',
      color: 'red',
      icon: <IconX size={16} />,
    })
  } finally {
    setLoading(false)
  }
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
          paddingTop: isMobile ? rem(100) : rem(120),
          paddingBottom: isMobile ? rem(60) : rem(80),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Box style={{ position: 'relative', zIndex: 1 }}>
            <Title
              order={1}
              style={{
                fontSize: isMobile ? rem(32) : rem(48),
                fontWeight: 800,
                color: 'white',
                textAlign: 'center',
                marginBottom: rem(16),
                lineHeight: 1.2,
              }}
            >
              Get in Touch
            </Title>
            <Text
              style={{
                fontSize: isMobile ? rem(16) : rem(18),
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                maxWidth: rem(600),
                margin: '0 auto',
                padding: isMobile ? '0 16px' : 0,
              }}
            >
              Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing together.
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

      <Container size="lg" style={{ marginTop: rem(-40), marginBottom: rem(60), padding: isMobile ? '0 16px' : 0 }}>
        {/* Contact Info Cards */}
        <SimpleGrid 
          cols={{ base: 1, sm: 2, md: 4 }} 
          spacing={isMobile ? 'sm' : 'md'} 
          mb={50}
        >
          {contactInfo.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                shadow="sm"
                padding={isMobile ? 'md' : 'lg'}
                radius="md"
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: item.link ? 'pointer' : 'default',
                }}
                onClick={() => item.link && window.open(item.link, '_blank')}
                className="hover:transform hover:-translate-y-1 hover:shadow-xl"
              >
                <ThemeIcon
                  size={isMobile ? 50 : 60}
                  radius={60}
                  variant="gradient"
                  gradient={{ from: item.color, to: item.color === 'blue' ? 'cyan' : item.color === 'green' ? 'lime' : item.color === 'red' ? 'pink' : 'violet' }}
                  style={{ margin: '0 auto 16px' }}
                >
                  <Icon size={isMobile ? 24 : 30} />
                </ThemeIcon>
                <Text fw={600} size={isMobile ? 'md' : 'lg'} mb={4} c={isDark ? 'white' : 'dark.9'}>{item.title}</Text>
                <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>{item.value}</Text>
              </Card>
            )
          })}
        </SimpleGrid>

        <Grid gutter={isMobile ? 'md' : 30}>
          {/* Contact Form */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper
              shadow="md"
              radius="lg"
              p={isMobile ? 'md' : 'xl'}
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              }}
            >
              <Title order={2} size={isMobile ? 'h3' : 'h2'} mb="md" c={isDark ? 'white' : 'dark.9'}>Send a Message</Title>
              <Text c="dimmed" mb="xl" size={isMobile ? 'sm' : 'md'}>
                Fill out the form below and I&apos;ll get back to you within 24 hours.
              </Text>

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Your Name"
                      placeholder="moges shitaw"
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps('name')}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                          borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                        },
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email Address"
                      placeholder="moges@example.com"
                      leftSection={<IconMail size={16} />}
                      {...form.getInputProps('email')}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                          borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                        },
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Subject"
                      placeholder="Project Inquiry"
                      leftSection={<IconMessage size={16} />}
                      {...form.getInputProps('subject')}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                          borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                        },
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Select
                      label="Service Interested In"
                      placeholder="Select a service"
                      data={[
                        'Web Development',
                        'Mobile App Development',
                        'UI/UX Design',
                        'Consulting',
                        'Other',
                      ]}
                      {...form.getInputProps('service')}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                          borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                        },
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                        dropdown: {
                          backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                        },
                        option: {
                          color: isDark ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
                          },
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Your Message"
                      placeholder="Tell me about your project..."
                      minRows={isMobile ? 4 : 5}
                      {...form.getInputProps('message')}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        input: {
                          backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                          color: isDark ? 'white' : 'black',
                          borderColor: isDark ? theme.colors.dark[3] : theme.colors.gray[2],
                        },
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Checkbox
                      label="I agree to the terms and privacy policy"
                      {...form.getInputProps('agree', { type: 'checkbox' })}
                      size={isMobile ? 'sm' : 'md'}
                      styles={{
                        label: {
                          color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                        },
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Button
                      type="submit"
                      size={isMobile ? 'md' : 'lg'}
                      fullWidth
                      loading={loading}
                      leftSection={<IconSend size={20} />}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        height: isMobile ? rem(44) : rem(48),
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid.Col>
                </Grid>
              </form>
            </Paper>
          </Grid.Col>

          {/* Right Column - Additional Info */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap={isMobile ? 'md' : 'md'}>
              {/* Social Links */}
              <Paper
                shadow="md"
                radius="lg"
                p={isMobile ? 'md' : 'xl'}
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              >
                <Title order={3} size={isMobile ? 'h4' : 'h3'} mb="md" c={isDark ? 'white' : 'dark.9'}>
                  Connect With Me
                </Title>
                <Group gap="md" justify="center">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <ActionIcon
                        key={social.label}
                        component="a"
                        href={social.href}
                        target="_blank"
                        size={isMobile ? 'lg' : 'xl'}
                        radius="xl"
                        variant="filled"
                        style={{
                          backgroundColor: social.color,
                          transition: 'transform 0.3s ease',
                        }}
                        className="hover:scale-110"
                      >
                        <Icon size={isMobile ? 18 : 24} />
                      </ActionIcon>
                    )
                  })}
                </Group>
              </Paper>

              {/* Map - Hide on mobile for better performance */}
              {!isMobile && (
                <Paper
                  shadow="md"
                  radius="lg"
                  style={{
                    height: isTablet ? rem(250) : rem(300),
                    overflow: 'hidden',
                    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25220.663755439125!2d38.746745!3d9.02497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location map"
                  />
                </Paper>
              )}

              {/* FAQ Section */}
              <Paper
                shadow="md"
                radius="lg"
                p={isMobile ? 'md' : 'xl'}
                style={{
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                }}
              >
                <Title order={3} size={isMobile ? 'h4' : 'h3'} mb="md" c={isDark ? 'white' : 'dark.9'}>
                  {isMobile ? 'FAQs' : 'Frequently Asked Questions'}
                </Title>
                <Stack gap="md">
                  {faqs.slice(0, isMobile ? 2 : 4).map((faq, index) => (
                    <Box key={index}>
                      <Text fw={600} size={isMobile ? 'sm' : 'md'} mb={4} c={isDark ? 'white' : 'dark.9'}>
                        {faq.question}
                      </Text>
                      <Text size={isMobile ? 'xs' : 'sm'} c="dimmed">{faq.answer}</Text>
                      {index < (isMobile ? 1 : 3) && (
                        <Divider 
                          my="md" 
                          style={{ borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2] }} 
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}