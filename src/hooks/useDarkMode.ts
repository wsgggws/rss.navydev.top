import { useState, useCallback, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      document.body.classList.toggle('light', !next)
      return next
    })
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', !isDark)
  }, [isDark])

  return { isDark, toggleTheme }
}
