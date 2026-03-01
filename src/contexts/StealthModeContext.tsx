import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface StealthModeContextType {
  stealthMode: boolean
  setStealthMode: (value: boolean) => void
}

const StealthModeContext = createContext<StealthModeContextType | undefined>(
  undefined,
)

export function StealthModeProvider({ children }: { children: ReactNode }) {
  const [stealthMode, setStealthMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stealth-mode')
      return saved !== null ? JSON.parse(saved) : true // Default to true (hidden)
    }
    return true
  })

  // Save stealth mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stealth-mode', JSON.stringify(stealthMode))
    }
  }, [stealthMode])

  // Toggle stealth mode with Alt key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Alt') {
        setStealthMode((prev: boolean) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <StealthModeContext.Provider value={{ stealthMode, setStealthMode }}>
      {children}
    </StealthModeContext.Provider>
  )
}

export function useStealthMode() {
  const context = useContext(StealthModeContext)
  if (context === undefined) {
    throw new Error('useStealthMode must be used within a StealthModeProvider')
  }
  return context
}
