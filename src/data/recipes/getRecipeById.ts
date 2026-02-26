import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Recipe } from './recipeSchemas'
import { getFromS3 } from '../../lib/s3'

export const getRecipeById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ recipeId: z.string() }))
  .handler(async (ctx): Promise<Recipe | null> => {
    try {
      const recipe: Recipe = await getFromS3(
        `recipes/${ctx.data.recipeId}.json`,
      )
      return recipe
    } catch (error) {
      console.error(`Error reading recipe ${ctx.data.recipeId}:`, error)
      return null
    }
  })
