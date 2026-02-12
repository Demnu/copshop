import { useState, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
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
  AppBar,
  Toolbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import HomeIcon from '@mui/icons-material/Home'
import BusinessIcon from '@mui/icons-material/Business'
import BadgeIcon from '@mui/icons-material/Badge'
import PeopleIcon from '@mui/icons-material/People'
import { useColorMode } from '../routes/__root'

const drawerWidth = 250

interface AppDrawerProps {
  children: ReactNode
}

export function AppDrawer({ children }: AppDrawerProps) {
  const [open, setOpen] = useState(true)
  const theme = useTheme()
  const colorMode = useColorMode()

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const menuItems = [
    { label: 'Home', icon: <HomeIcon />, to: '/home' as const },
    {
      label: 'Organizations',
      icon: <BusinessIcon />,
      to: '/organizations' as const,
    },
    {
      label: 'Police Officers',
      icon: <BadgeIcon />,
      to: '/police-officers' as const,
    },
    { label: 'Users', icon: <PeopleIcon />, to: '/users' as const },
  ]

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
            CopShop
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
