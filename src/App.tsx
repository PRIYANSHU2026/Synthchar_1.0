import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Home from './pages/Home'

// Load fonts
useEffect(() => {
  // Add Inter font link
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}, [])

function App() {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App