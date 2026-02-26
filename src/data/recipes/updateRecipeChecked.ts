import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Recipe } from './recipeSchemas'
import { getFromS3, putToS3 } from '../../lib/s3'

export const updateRecipeChecked = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      recipeId: z.string(),
      ingredientIndex: z.number(),
      checked: z.boolean(),
    }),
  )
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { recipeId, ingredientIndex, checked } = ctx.data
    try {
      let recipe: Recipe = await getFromS3(`recipes/${recipeId}.json`)
      if (recipe.ingredients[ingredientIndex]) {
        recipe.ingredients[ingredientIndex].checked = checked
      }
      await putToS3(`recipes/${recipeId}.json`, recipe)
      return { success: true }
    } catch (error) {
      console.error(`Error updating recipe ${recipeId}:`, error)
      throw new Error('Failed to update recipe')
    }
  })
