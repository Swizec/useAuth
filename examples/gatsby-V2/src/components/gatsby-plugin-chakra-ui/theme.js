import { theme as defaultTheme } from '@chakra-ui/core';
import CustomColors from './CustomColor';

const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    ...CustomColors, // add a file with custom colors and spread them here or just list them
  },
  breakpoints: ["30rem", "48rem", "62rem", "80rem"],
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
    mono: "Menlo, monospace",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
  },
  fontWeights: {
    100: 100,
    200: 200,
    300: 300,
    400: 400,
    500: 500,
    600: 600,
    700: 700,
    800: 800,
    900: 900,
  },
  lineHeights: {
    tiny: "0.8",
    normal: "normal",
    base: "1",
    shorter: "1.2",
    short: "1.4",
    tall: "1.6",
    taller: "2",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  space: {
    "0": "0",
    "1": "0.125rem",
    "2": "0.25rem",
    "3": "0.5rem",
    "4": "1rem",
    "5": "1.5rem",
    "6": "2rem",
    "8": "2.5em",
    "10": "3rem",
    "11": "3.5rem",
    "12": "4rem",
    "16": "6rem",
    "20": "8rem",
    "24": "11rem",
    "32": "16rem",
  },
  
};

export default theme;