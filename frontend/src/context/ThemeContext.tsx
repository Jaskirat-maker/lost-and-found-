/* eslint-disable react-refresh/only-export-components */
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('lf_theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('lf_theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
        setTheme: (t) => setThemeState(t),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

