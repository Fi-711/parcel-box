import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#2E3A59',
    100: '#D04547',
    200: '#E5E5E5',
    300: '#616161',
  },
};

const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'gray.300')(props),
      bg: mode('brand.200', '#141214')(props),
    },
  }),
};

const components = {
  // change components here
  Heading: {
    baseStyle: (props) => ({
      fontFamily: 'Montserrat, Open Sans, sans-serif',
      fontWeight: 1000,
    }),
  },
  Text: {
    baseStyle: (props) => ({
      fontFamily: 'Montserrat, Open Sans, sans-serif',
    }),
  },
};

const fonts = {
  fonts: {
    heading: 'Montserrat, Open Sans, sans-serif',
    body: 'Montserrat, Raleway, sans-serif',
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components,
  styles,
  colors,
  fonts,
});

export default theme;
