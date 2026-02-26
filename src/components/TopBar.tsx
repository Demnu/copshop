import { Link } from '@tanstack/react-router'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { useColorMode } from '../routes/__root'

export function TopBar() {
  const theme = useTheme()
  const colorMode = useColorMode()

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Link
          to="/home"
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 0,
              mr: 4,
              fontWeight: 700,
            }}
          >
            CopShop
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Link to="/home">
            <Button color="inherit" startIcon={<HomeIcon />}>
              Home
            </Button>
          </Link>
          <Link to="/users">
            <Button color="inherit" startIcon={<PeopleIcon />}>
              Users
            </Button>
          </Link>
          <Link to="/recipes">
            <Button color="inherit" startIcon={<RestaurantIcon />}>
              Recipes
            </Button>
          </Link>
        </Box>

        <IconButton
          onClick={colorMode.toggleColorMode}
          color="inherit"
          title="Toggle theme"
        >
          {theme.palette.mode === 'dark' ? '☀️' : '🌙'}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
