import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Simple greeting server function for demos
export const getGreeting = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ name: z.string() }))
  .handler(async (ctx): Promise<{ message: string }> => {
    return { message: `Hello, ${ctx.data.name}! (from server)` }
  })
