import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  PaletteMode,
  IconButton,
  Box,
  useTheme,
} from '@mui/material'
import { useState, useMemo, createContext, useContext, useEffect } from 'react'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const useColorMode = () => useContext(ColorModeContext)

const queryClient = new QueryClient()

export const Route = createRootRoute({
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
        title: 'CopShop - TanStack Start',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('dark')

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

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box sx={{ minHeight: '100vh' }}>
                <ThemeToggle />
                {children}
              </Box>
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function ThemeToggle() {
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
        title="Toggle theme"
      >
        {theme.palette.mode === 'dark' ? '☀️' : '🌙'}
      </IconButton>
    </Box>
  )
}
