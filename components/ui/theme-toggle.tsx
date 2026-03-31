'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="h-10 w-10 border-2 border-black bg-white">
        <div className="h-4 w-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-white" />
      ) : (
        <Moon className="h-4 w-4 text-black" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
