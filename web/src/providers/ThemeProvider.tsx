import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = localStorage.getItem('theme')
    // Direct string comparison only — no JSON.parse to prevent injection (LOW-9).
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    applyTheme(stored)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    // Store as a plain string literal — never JSON.stringify (LOW-9).
    try { localStorage.setItem('theme', newTheme) } catch {}
  }

  const toggleTheme = () => {
    setThemeState((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark'
      applyTheme(newTheme)
      try { localStorage.setItem('theme', newTheme) } catch {}
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
