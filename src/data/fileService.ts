import { createServerFn } from '@tanstack/react-start'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars')

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist
  }
}

// Upload avatar file
export const uploadAvatar = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      base64: z.string(),
      filename: z.string(),
      userId: z.string(),
    }),
  )
  .handler(async (ctx): Promise<{ path: string }> => {
    await ensureUploadDir()

    // Extract base64 data
    const base64Data = ctx.data.base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate filename with user ID
    const ext = ctx.data.filename.split('.').pop() || 'jpg'
    const filename = `${ctx.data.userId}.${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Return public URL path
    return { path: `/uploads/avatars/${filename}` }
  })

// Delete avatar file
export const deleteAvatar = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ path: z.string() }))
  .handler(async (ctx): Promise<{ success: boolean }> => {
    try {
      const { unlink } = await import('fs/promises')
      const filename = ctx.data.path.split('/').pop()
      if (filename) {
        const filepath = join(UPLOAD_DIR, filename)
        await unlink(filepath)
      }
      return { success: true }
    } catch (error) {
      // File might not exist
      return { success: false }
    }
  })
