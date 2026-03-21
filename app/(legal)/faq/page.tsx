/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Accordion,
  ThemeIcon,
  Group,
  Anchor,
  Button,
  TextInput,
  Textarea,
  Modal,
  useMantineTheme,
  useMantineColorScheme,
  Center,
  Loader,
  Alert,
  SimpleGrid,
  Card,
  Badge,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconHelp,
  IconMessage,
  IconSend,
  IconCheck,
  IconX,
  IconMail,
  IconCode,
  IconBriefcase,
  IconRocket,
  IconSearch,
  IconUsers,
  IconShield,
} from '@tabler/icons-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import apiClient from '@/lib/api';

// FAQ Categories and Questions
const faqCategories = [
  {
    id: 'general',
    title: 'General Questions',
    icon: IconHelp,
    color: 'blue',
    questions: [
      {
        q: "Who is Moges Shitaw?",
        a: "I'm a passionate Full Stack Developer with expertise in modern web technologies. I specialize in building full-stack web applications using React, Next.js, Node.js, and various databases. I love creating elegant solutions to complex problems and building applications that make a difference."
      },
      {
        q: "What services do you offer?",
        a: "I offer a wide range of development services including web development, frontend development, backend development, full stack development, UI/UX design, database design, and cloud deployment. I work with modern technologies like React, Next.js, Node.js, TypeScript, and more."
      },
      {
        q: "How can I contact you?",
        a: "You can contact me through the contact form on this website, or directly via email at mogesshitaw318@gmail.com. I typically respond within 24 hours."
      },
      {
        q: "Where are you located?",
        a: "I'm based in Addis Ababa, Ethiopia, but I work with clients from all around the world remotely."
      }
    ]
  },
  {
    id: 'services',
    title: 'Services & Pricing',
    icon: IconBriefcase,
    color: 'green',
    questions: [
      {
        q: "What technologies do you specialize in?",
        a: "I specialize in modern web technologies including React, Next.js, Node.js, TypeScript, Python, PHP, MySQL, PostgreSQL, MongoDB, and various cloud services like AWS and Vercel. I also have experience with Tailwind CSS, Mantine, and other modern frameworks."
      },
      {
        q: "How do you price your services?",
        a: "My pricing varies depending on the project scope, complexity, and timeline. I offer flexible pricing models including hourly rates, fixed project rates, and retainer agreements. Contact me for a personalized quote based on your specific project needs."
      },
      {
        q: "Do you offer ongoing support after project completion?",
        a: "Yes! I offer maintenance and support packages to ensure your project runs smoothly after launch. This includes bug fixes, security updates, performance optimization, and feature enhancements."
      },
      {
        q: "What is your typical project timeline?",
        a: "Project timelines vary based on complexity. A simple website might take 2-4 weeks, while complex web applications can take 2-6 months. I'll provide a detailed timeline during our initial consultation."
      }
    ]
  },
  {
    id: 'process',
    title: 'Working Process',
    icon: IconRocket,
    color: 'grape',
    questions: [
      {
        q: "What is your development process?",
        a: "I follow an agile methodology with regular updates and clear milestones. The process includes: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development, 4) Testing & QA, 5) Deployment, and 6) Ongoing Support."
      },
      {
        q: "How do you communicate with clients during the project?",
        a: "I use various communication channels including email, video calls, and project management tools. I provide regular progress updates and am available for meetings to discuss project requirements and feedback."
      },
      {
        q: "Do you provide design services as well?",
        a: "Yes! I offer UI/UX design services including wireframing, prototyping, and final design implementation. I can work with your existing designs or create new ones from scratch."
      },
      {
        q: "How do you handle project revisions?",
        a: "I include a certain number of revision rounds in my project quotes. Additional revisions can be accommodated at an agreed-upon rate. Clear communication during the development process helps minimize major revisions."
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Questions',
    icon: IconCode,
    color: 'orange',
    questions: [
      {
        q: "What frameworks and libraries do you use?",
        a: "I primarily work with React and Next.js for frontend development, and Node.js with Express for backend. I also have experience with PHP/Laravel, Python/Django, and other frameworks. For styling, I use Mantine, Tailwind CSS, and CSS modules."
      },
      {
        q: "Do you build mobile apps?",
        a: "Yes, I can build mobile applications using React Native, which allows me to create cross-platform apps for both iOS and Android using JavaScript/TypeScript."
      },
      {
        q: "How do you ensure code quality?",
        a: "I follow best practices including code reviews, automated testing, and continuous integration. I write clean, maintainable, and well-documented code following industry standards like ESLint and Prettier."
      },
      {
        q: "Do you provide SEO optimization?",
        a: "Yes, I build websites with SEO best practices in mind including semantic HTML, proper meta tags, optimized performance, and mobile responsiveness. I can also provide additional SEO consultation if needed."
      }
    ]
  },
  {
    id: 'payment',
    title: 'Payment & Contracts',
    icon: IconShield,
    color: 'red',
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "I accept payments via bank transfer, PayPal, and other international payment platforms. Payment terms are discussed and agreed upon before starting any project."
      },
      {
        q: "Do you require a deposit?",
        a: "Yes, I typically require a 30-50% deposit before starting work, with the remaining balance due upon project completion. For larger projects, we can arrange milestone-based payments."
      },
      {
        q: "Do you provide contracts?",
        a: "Yes, I provide detailed contracts outlining project scope, timeline, deliverables, payment terms, and other important details to ensure both parties are protected."
      }
    ]
  },
  {
    id: 'clients',
    title: 'For Clients',
    icon: IconUsers,
    color: 'teal',
    questions: [
      {
        q: "What do I need to provide to get started?",
        a: "I'll need a clear project brief including your goals, target audience, desired features, any existing branding materials, and your budget and timeline expectations."
      },
      {
        q: "How do you handle project confidentiality?",
        a: "I take confidentiality seriously and am happy to sign NDAs. All project information is kept strictly confidential and not shared with third parties."
      },
      {
        q: "Do you offer refunds?",
        a: "I strive for 100% client satisfaction. Refunds are considered on a case-by-case basis depending on the work completed. Clear communication throughout the project helps avoid misunderstandings."
      },
      {
        q: "Can I see examples of your previous work?",
        a: "Absolutely! You can view my portfolio on the projects page, which showcases some of my best work. I can also provide additional case studies and references upon request."
      }
    ]
  }
];

export default function FAQPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>('all');
  const [questionModalOpened, { open: openQuestionModal, close: closeQuestionModal }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);
  
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const questionForm = useForm({
    initialValues: {
      name: '',
      email: '',
      question: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      question: (value) => (value.length < 10 ? 'Question must be at least 10 characters' : null),
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchQuery, activeCategory]);

  const filterQuestions = () => {
    let questions: any[] = [];
    
    if (activeCategory === 'all') {
      faqCategories.forEach(category => {
        questions.push(...category.questions.map(q => ({ ...q, category: category.title, categoryId: category.id })));
      });
    } else {
      const category = faqCategories.find(c => c.id === activeCategory);
      if (category) {
        questions = category.questions.map(q => ({ ...q, category: category.title, categoryId: category.id }));
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      questions = questions.filter(q => 
        q.q.toLowerCase().includes(query) || 
        q.a.toLowerCase().includes(query)
      );
    }
    
    setFilteredQuestions(questions);
  };

  const handleSubmitQuestion = async (values: typeof questionForm.values) => {
    setSubmitting(true);
    try {
      const response = await apiClient.post('/faq/questions', {
        name: values.name,
        email: values.email,
        question: values.question,
      });
      
      notifications.show({
        title: 'Question Submitted',
        message: response.data.message || 'Thank you! I\'ll get back to you soon.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      
      questionForm.reset();
      closeQuestionModal();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to submit question. Please try again.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // FIXED: Show loading state during SSR and initial mount - NO dark mode colors
  if (!mounted) {
    return (
      <>
        <Navbar />
        <Box style={{ 
          minHeight: 'calc(100vh - 70px)', 
          backgroundColor: '#f8f9fa'  // Fixed light color for SSR
        }}>
          <Center style={{ height: 'calc(100vh - 70px)' }}>
            <Loader size="lg" color="blue" />  {/* Fixed color */}
          </Center>
        </Box>
        <Footer />
      </>
    );
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
          paddingTop: '100px',
          paddingBottom: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius={80} variant="white" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <IconHelp size={48} color="white" />
            </ThemeIcon>
            <Title order={1} size="3rem" c="white" ta="center">
              Frequently Asked Questions
            </Title>
            <Text size="lg" c="white" ta="center" opacity={0.9} maw={700}>
              Find answers to common questions about my services, process, and how we can work together
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Search Bar */}
          <Paper
            p="md"
            radius="lg"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[6] : 'white',
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            }}
          >
            <TextInput
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={18} />}
              size="lg"
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[5] : 'white',
                  color: isDark ? 'white' : 'black',
                },
              }}
            />
          </Paper>

          {/* Category Tabs */}
          <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="sm">
            <Card
              p="sm"
              radius="md"
              withBorder
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                backgroundColor: activeCategory === 'all' 
                  ? (isDark ? theme.colors.blue[9] : theme.colors.blue[0])
                  : (isDark ? theme.colors.dark[6] : 'white'),
                borderColor: activeCategory === 'all' ? theme.colors.blue[6] : (isDark ? theme.colors.dark[4] : theme.colors.gray[2]),
                transition: 'all 0.2s ease',
              }}
              onClick={() => setActiveCategory('all')}
            >
              <IconHelp size={24} color={activeCategory === 'all' ? theme.colors.blue[6] : (isDark ? 'white' : 'gray')} />
              <Text size="sm" fw={500} mt={4} c={activeCategory === 'all' ? 'blue.6' : (isDark ? 'white' : 'dark.9')}>
                All
              </Text>
            </Card>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <Card
                  key={category.id}
                  p="sm"
                  radius="md"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: isActive 
                      ? (isDark ? theme.colors[category.color][9] : theme.colors[category.color][0])
                      : (isDark ? theme.colors.dark[6] : 'white'),
                    borderColor: isActive ? theme.colors[category.color][6] : (isDark ? theme.colors.dark[4] : theme.colors.gray[2]),
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon size={24} color={isActive ? theme.colors[category.color][6] : (isDark ? 'white' : 'gray')} />
                  <Text size="sm" fw={500} mt={4} c={isActive ? `${category.color}.6` : (isDark ? 'white' : 'dark.9')}>
                    {category.title}
                  </Text>
                </Card>
              );
            })}
          </SimpleGrid>

          {/* Results Count */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'} found
            </Text>
            <Button
              variant="light"
              leftSection={<IconMessage size={16} />}
              onClick={openQuestionModal}
            >
              Ask a Question
            </Button>
          </Group>

          {/* FAQ Accordion */}
          {filteredQuestions.length === 0 ? (
            <Paper
              p="xl"
              radius="lg"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                textAlign: 'center',
              }}
            >
              <IconHelp size={48} color={isDark ? theme.colors.gray[6] : theme.colors.gray[5]} style={{ marginBottom: 16 }} />
              <Title order={3} mb="sm" c={isDark ? 'white' : 'dark.9'}>
                No questions found
              </Title>
              <Text c="dimmed" mb="lg">
                Try adjusting your search or ask a new question
              </Text>
              <Button onClick={openQuestionModal} leftSection={<IconMessage size={16} />}>
                Ask a Question
              </Button>
            </Paper>
          ) : (
            <Paper
              radius="lg"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                overflow: 'hidden',
              }}
            >
              <Accordion variant="separated">
                {filteredQuestions.map((item, index) => (
                  <Accordion.Item key={index} value={`question-${index}`}>
                    <Accordion.Control
                      icon={
                        <ThemeIcon color={faqCategories.find(c => c.id === item.categoryId)?.color || 'blue'} size={32} radius="xl" variant="light">
                          {(() => {
                            const category = faqCategories.find(c => c.id === item.categoryId);
                            const Icon = category?.icon || IconHelp;
                            return <Icon size={18} />;
                          })()}
                        </ThemeIcon>
                      }
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Text fw={500} size="md" c={isDark ? 'white' : 'dark.9'}>
                          {item.q}
                        </Text>
                        <Badge size="sm" variant="light" color={faqCategories.find(c => c.id === item.categoryId)?.color || 'blue'}>
                          {item.category}
                        </Badge>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                        {item.a}
                      </Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Paper>
          )}

          {/* Still Have Questions Section */}
          <Paper
            p="xl"
            radius="lg"
            withBorder
            style={{
              background: isDark ? theme.colors.dark[6] : 'white',
              textAlign: 'center',
            }}
          >
            <IconMail size={40} color={theme.colors.blue[6]} style={{ marginBottom: 16 }} />
            <Title order={3} mb="sm" c={isDark ? 'white' : 'dark.9'}>
              Still have questions?
            </Title>
            <Text c="dimmed" mb="lg" maw={500} mx="auto">
              Can&apos;t find the answer you&apos;re looking for? Feel free to reach out and I&apos;ll get back to you as soon as possible.
            </Text>
            <Group justify="center" gap="md">
              <Button
                onClick={openQuestionModal}
                leftSection={<IconMessage size={16} />}
                variant="gradient"
                gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
              >
                Ask a Question
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="light"
                leftSection={<IconMail size={16} />}
              >
                Contact Me
              </Button>
            </Group>
          </Paper>
        </Stack>
      </Container>

      {/* Ask Question Modal */}
      <Modal
        opened={questionModalOpened}
        onClose={closeQuestionModal}
        title="Ask a Question"
        size="md"
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
          },
        }}
      >
        <form onSubmit={questionForm.onSubmit(handleSubmitQuestion)}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Have a question not listed? Submit it here and I&apos;ll get back to you within 24 hours.
            </Text>
            
            <TextInput
              label="Your Name"
              placeholder="John Doe"
              required
              {...questionForm.getInputProps('name')}
              disabled={submitting}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />
            
            <TextInput
              label="Your Email"
              placeholder="john@example.com"
              required
              {...questionForm.getInputProps('email')}
              disabled={submitting}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />
            
            <Textarea
              label="Your Question"
              placeholder="What would you like to know?"
              minRows={4}
              required
              {...questionForm.getInputProps('question')}
              disabled={submitting}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : 'white',
                  color: isDark ? 'white' : 'black',
                },
                label: {
                  color: isDark ? theme.colors.gray[3] : theme.colors.dark[6],
                },
              }}
            />
            
            <Button
              type="submit"
              loading={submitting}
              leftSection={<IconSend size={16} />}
              fullWidth
              variant="gradient"
              gradient={{ from: '#667eea', to: '#764ba2', deg: 135 }}
            >
              Submit Question
            </Button>
          </Stack>
        </form>
      </Modal>

      <Footer />
    </Box>
  );
}