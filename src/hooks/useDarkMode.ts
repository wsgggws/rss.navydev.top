import { useState, useCallback, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {
        // Theme switching still works for the current session.
      }
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    )
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      isDark ? '#101513' : '#f3f5f4',
    )
  }, [isDark])

  return { isDark, toggleTheme }
}
