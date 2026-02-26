import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Recipe } from './recipeSchemas'
import { getFromS3, putToS3 } from '../../lib/s3'

export const clearAllRecipeChecked = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      recipeId: z.string(),
    }),
  )
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { recipeId } = ctx.data
    try {
      let recipe: Recipe = await getFromS3(`recipes/${recipeId}.json`)
      recipe.ingredients = recipe.ingredients.map((ing) => ({
        ...ing,
        checked: false,
      }))
      await putToS3(`recipes/${recipeId}.json`, recipe)
      return { success: true }
    } catch (error) {
      console.error(`Error clearing recipe ${recipeId}:`, error)
      throw new Error('Failed to clear recipe')
    }
  })
