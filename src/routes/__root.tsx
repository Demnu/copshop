import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  PaletteMode,
} from '@mui/material'
import { useState, useMemo, createContext, useContext } from 'react'
import { AppDrawer } from '../components/Drawer'

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
    links: [
      {
        rel: 'preload',
        href: '/bloody_hands.png',
        as: 'image',
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
              <AppDrawer>{children}</AppDrawer>
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
