import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /* Put your mantine theme override here */
  colors: {
    // Add your custom colors if needed
  },
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});