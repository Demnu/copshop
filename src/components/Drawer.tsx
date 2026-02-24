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
import PeopleIcon from '@mui/icons-material/People'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import PianoIcon from '@mui/icons-material/Piano'
import { useColorMode } from '../routes/__root'

// Type-safe route paths from TanStack Router
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
  const theme = useTheme()
  const colorMode = useColorMode()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Save drawer state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drawer-open', JSON.stringify(open))
    }
  }, [open])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const menuItems: readonly MenuItem[] = [
    { label: 'Home', icon: <HomeIcon />, to: '/home' },
    { label: 'Users', icon: <PeopleIcon />, to: '/users' },
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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Enablar
          </Typography>
          <IconButton
            onClick={colorMode.toggleColorMode}
            color="inherit"
            title="Toggle theme"
          >
            {theme.palette.mode === 'dark' ? '☀️' : '🌙'}
          </IconButton>
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
        <Box sx={{ overflow: 'auto' }}>
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
