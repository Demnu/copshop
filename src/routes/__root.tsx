import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  PaletteMode,
} from '@mui/material'
import { useState, useMemo, createContext, useContext, useEffect } from 'react'
import { AppDrawer } from '../components/Drawer'
import { StealthModeProvider } from '../contexts/StealthModeContext'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const useColorMode = () => useContext(ColorModeContext)

const queryClient = new QueryClient()

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Enablar - Recipe & Note Manager',
      },
      {
        name: 'description',
        content: 'Manage recipes and practice music notes',
      },
      {
        name: 'theme-color',
        content: '#667eea',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Enablar',
      },
    ],
    links: [
      {
        rel: 'preload',
        href: '/bloody_hands.png',
        as: 'image',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
      {
        rel: 'apple-touch-icon',
        href: '/logo192.png',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#667eea',
          },
          secondary: {
            main: '#764ba2',
          },
          ...(mode === 'dark' && {
            background: {
              default: '#0a0a0a',
              paper: '#1a1a2e',
            },
          }),
        },
      }),
    [mode],
  )

  // Register service worker for PWA
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration.scope)
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error)
          })
      })
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <StealthModeProvider>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppDrawer>{children}</AppDrawer>
                {/* <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              /> */}
              </ThemeProvider>
            </ColorModeContext.Provider>
          </StealthModeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
