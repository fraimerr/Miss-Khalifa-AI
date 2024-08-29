'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

const ToggleDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode !== null) {
      setDarkMode(JSON.parse(storedDarkMode))
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      setDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))

    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggleDarkMode}
      className="w-full py-6"
    >
      <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export default ToggleDarkMode
