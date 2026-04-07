import { heroui } from '@heroui/react'

export default heroui({
  themes: {
    dark: {
      colors: {
        background: '#08090a',
        foreground: '#f7f8f8',
        primary: { DEFAULT: '#5e6ad2', foreground: '#ffffff' },
        secondary: { DEFAULT: '#7170ff', foreground: '#ffffff' },
        success: { DEFAULT: '#10b981', foreground: '#ffffff' },
        warning: { DEFAULT: '#f59e0b', foreground: '#08090a' },
        danger: { DEFAULT: '#ef4444', foreground: '#ffffff' },
        content1: '#0f1011',
        content2: '#191a1b',
        content3: '#28282c',
        content4: '#3e3e44',
        default: {
          50: '#f7f8f8',
          100: '#d0d6e0',
          200: '#8a8f98',
          300: '#62666d',
          foreground: '#f7f8f8',
        },
        focus: '#7170ff',
      },
      layout: {
        radius: { small: '6px', medium: '10px', large: '14px' },
        borderWidth: { small: '1px', medium: '1px', large: '2px' },
      },
    },
  },
})
