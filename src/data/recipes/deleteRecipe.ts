import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { deleteFromS3 } from '../../lib/s3'

export const deleteRecipe = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ recipeId: z.string() }))
  .handler(async (ctx): Promise<{ success: boolean }> => {
    try {
      await deleteFromS3(`recipes/${ctx.data.recipeId}.json`)
      return { success: true }
    } catch (error) {
      console.error('Failed to delete recipe:', error)
      throw new Error('Failed to delete recipe: ' + error)
    }
  })
