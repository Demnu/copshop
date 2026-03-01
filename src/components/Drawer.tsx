import { useState, ReactNode, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import HomeIcon from '@mui/icons-material/Home'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PianoIcon from '@mui/icons-material/Piano'
import { grey } from '@mui/material/colors'

interface Scribble {
  id: number
  x: number
  y: number
  length: number
  angle: number
  opacity: number
  dashOffset: number
  path: string
  pathLength: number
}

// Smooth flowing scribble
function generateSmoothScribble(length: number): string {
  const segments = 20
  let path = 'M 0 0'
  let prevX = 0
  let prevY = 0

  for (let i = 1; i <= segments; i++) {
    const progress = i / segments
    const px = progress * length
    const py = (Math.random() - 0.5) * 10

    // Control point for smooth curve
    const cpx = prevX + (px - prevX) * 0.5
    const cpy = prevY + (Math.random() - 0.5) * 6

    path += ` Q ${cpx} ${cpy}, ${px} ${py}`
    prevX = px
    prevY = py
  }
  return path
}

function FadingScribbles() {
  const [scribbles, setScribbles] = useState<Scribble[]>([])

  useEffect(() => {
    let nextId = 0

    const spawnScribble = () => {
      const x = 5 + Math.random() * 90
      const y = 10 + Math.random() * 80
      const length = 300 + Math.random() * 200
      const angle = -60 + Math.random() * 120

      // Randomly choose between smooth and jagged scribble
      const scribbleGenerators = [generateSmoothScribble]
      const generator =
        scribbleGenerators[
          Math.floor(Math.random() * scribbleGenerators.length)
        ]
      const path = generator(length)
      const pathLength = length * 1.2

      const newScribble: Scribble = {
        id: nextId++,
        x,
        y,
        length,
        angle,
        opacity: 1,
        dashOffset: pathLength,
        path,
        pathLength,
      }

      setScribbles((prev) => [...prev, newScribble])

      // Draw in (animate dashOffset from full to 0)
      setTimeout(() => {
        setScribbles((prev) =>
          prev.map((s) =>
            s.id === newScribble.id ? { ...s, dashOffset: 0 } : s,
          ),
        )
      }, 50)

      // Fade out (after staying visible for a bit)
      setTimeout(() => {
        setScribbles((prev) =>
          prev.map((s) => (s.id === newScribble.id ? { ...s, opacity: 0 } : s)),
        )
      }, 3000)

      // Remove
      setTimeout(() => {
        setScribbles((prev) => prev.filter((s) => s.id !== newScribble.id))
      }, 4000)
    }

    // Spawn initial scribbles
    for (let i = 0; i < 2; i++) {
      setTimeout(() => spawnScribble(), i * 800)
    }

    // Continuous spawning
    const interval = setInterval(spawnScribble, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {scribbles.map((scribble) => {
        return (
          <Box
            key={scribble.id}
            component="svg"
            sx={{
              position: 'absolute',
              left: `${scribble.x}%`,
              top: `${scribble.y}%`,
              width: `${scribble.length}px`,
              height: '20px',
              transform: `translate(-50%, -50%) rotate(${scribble.angle}deg)`,
              opacity: scribble.opacity,
              transition: 'opacity 1s ease-in-out',
              pointerEvents: 'none',
              overflow: 'visible',
              zIndex: 0,
            }}
          >
            <path
              d={scribble.path}
              stroke="#cc0000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={scribble.pathLength}
              strokeDashoffset={scribble.dashOffset}
              style={{
                transition: 'stroke-dashoffset 0.6s ease-out',
              }}
            />
          </Box>
        )
      })}
    </>
  )
}

// Type-safe route paths from TanStack Router// Type-safe route paths from TanStack Router
type AppRoutes = LinkProps['to']

const drawerWidth = 250

interface MenuItem {
  label: string
  icon: ReactNode
  to: AppRoutes
}

interface AppDrawerProps {
  children: ReactNode
}

export function AppDrawer({ children }: AppDrawerProps) {
  const [open, setOpen] = useState(true)
  const [stealthMode, setStealthMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stealth-mode')
      return saved !== null ? JSON.parse(saved) : true // Default to true (hidden)
    }
    return true
  })
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Save drawer state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drawer-open', JSON.stringify(open))
    }
  }, [open])

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

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const menuItems: readonly MenuItem[] = [
    { label: 'Home', icon: <HomeIcon />, to: '/' },
    { label: 'Recipes', icon: <RestaurantIcon />, to: '/recipes' },
    {
      label: 'Piano Note Tester',
      icon: <PianoIcon />,
      to: '/piano-note-tester',
    },
  ] as const

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        elevation={2}
      >
        <Toolbar
          onClick={() => setStealthMode(!stealthMode)}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: grey[900],
            cursor: 'pointer',
          }}
        >
          {!stealthMode && <FadingScribbles />}
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={(e) => {
              e.stopPropagation()
              toggleDrawer()
            }}
            sx={{ mr: 2, zIndex: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, zIndex: 1 }}
          >
            Enablar
          </Typography>

          {!stealthMode && (
            <>
              {/* Red Triangle (upside down) */}
              <Box
                sx={{
                  width: '32px',
                  height: '28px',
                  backgroundColor: '#cc0000',
                  marginRight: 2,
                  zIndex: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                }}
              />

              {/* Australian Aboriginal Flag */}
              <Box
                sx={{
                  position: 'relative',
                  width: '48px',
                  height: '32px',
                  marginRight: 2,
                  zIndex: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    backgroundColor: '#000000',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    backgroundColor: '#e71d23',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#ffcc00',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </Box>

              {/* Irish Flag */}
              <Box
                sx={{
                  display: 'flex',
                  width: '48px',
                  height: '32px',
                  zIndex: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                <Box sx={{ flex: 1, backgroundColor: '#169b62' }} />
                <Box sx={{ flex: 1, backgroundColor: '#ffffff' }} />
                <Box sx={{ flex: 1, backgroundColor: '#ff883e' }} />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Navigation
              </Typography>
              <IconButton onClick={toggleDrawer} size="small">
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <Link
                  onClick={() => {
                    if (isMobile) {
                      setOpen(false)
                    }
                  }}
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? 0 : `-${drawerWidth}px`,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
