import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = ['purple', 'green', 'red', 'cyan']
const DEFAULT_THEME = 'purple'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme')
    return THEMES.includes(saved) ? saved : DEFAULT_THEME
  })

  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach(t => root.classList.remove(`theme-${t}`))
    root.classList.add(`theme-${theme}`)
    localStorage.setItem('theme', theme)
  }, [theme])

  const setTheme = (t) => {
    if (THEMES.includes(t)) setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
