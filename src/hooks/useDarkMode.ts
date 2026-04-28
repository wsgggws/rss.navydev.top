import { useState, useCallback } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  return { isDark, toggleTheme }
}
