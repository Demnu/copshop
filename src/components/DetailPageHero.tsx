import { Box, Typography, Avatar, Chip, Button, Paper } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import type { ReactNode } from 'react'
import { useMemo, useState, useEffect } from 'react'

// Background style constants
const BACKGROUND_STYLES = {
  BLUE: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  BROWNSHIRT: 'linear-gradient(135deg, #4a2c0d 0%, #6b4423 50%, #8b5a2b 100%)',
} as const

interface DetailPageHeroProps {
  backLink: {
    to: string
    label: string
  }
  avatar?: {
    text: string
    src?: string
  }
  title: string
  badge?: {
    label: string
    color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
  }
  infoPills?: ReactNode
  actions?: ReactNode
  backgroundStyle?: keyof typeof BACKGROUND_STYLES
}

export function DetailPageHero({
  backLink,
  avatar,
  title,
  badge,
  infoPills,
  actions,
  backgroundStyle = 'BLUE',
}: DetailPageHeroProps) {
  // Defer rendering bloody hands until after mount to prevent freeze
  const [showHands, setShowHands] = useState(false)

  useEffect(() => {
    // Render hands after a short delay to prioritize critical content
    const timer = setTimeout(() => setShowHands(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Generate random positions and transforms for bloody hands
  const bloodyHands = useMemo(() => {
    const hands = []
    const count = 3 // Number of hand images

    for (let i = 0; i < count; i++) {
      hands.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        scale: 0.6 + Math.random() * 0.4, // 0.6 to 1.0
        flipX: Math.random() > 0.5,
        opacity: 1,
      })
    }
    return hands
  }, [])

  return (
    <Paper
      elevation={0}
      sx={{
        background: BACKGROUND_STYLES[backgroundStyle],
        color: 'white',
        py: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Bloody hands background decoration */}
      {showHands && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          {bloodyHands.map((hand) => (
            <Box
              key={hand.id}
              component="img"
              src="/bloody_hands.png"
              alt=""
              sx={{
                position: 'absolute',
                top: hand.top,
                left: hand.left,
                width: '120px',
                height: 'auto',
                opacity: hand.opacity,
                transform: `
                translate(-50%, -50%)
                scale(${hand.scale})
                scaleX(${hand.flipX ? -1 : 1})
              `,
                filter: 'brightness(0.8)',
              }}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Button
          component={Link}
          to={backLink.to}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: 'white',
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {backLink.label}
        </Button>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 2, sm: 3 },
          }}
        >
          {avatar && (
            <Avatar
              src={avatar.src}
              sx={{
                width: { xs: 80, sm: 80, md: 120 },
                height: { xs: 80, sm: 80, md: 120 },
                fontSize: { xs: '2rem', sm: '2rem', md: '3rem' },
                bgcolor: 'rgba(255,255,255,0.3)',
                border: {
                  xs: '3px solid white',
                  sm: '3px solid white',
                  md: '4px solid white',
                },
                boxShadow: 3,
              }}
            >
              {avatar.text}
            </Avatar>
          )}

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              width: { xs: '100%', sm: 'auto' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: { xs: 1, sm: 2 },
                mb: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </Typography>
              {badge && (
                <Chip
                  label={badge.label}
                  color={badge.color}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: { xs: 24, sm: 32 },
                  }}
                />
              )}
            </Box>

            {infoPills}

            {actions && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: { xs: 1, sm: 2 },
                  mt: { xs: 1, sm: 2 },
                  flexWrap: 'wrap',
                }}
              >
                {actions}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
