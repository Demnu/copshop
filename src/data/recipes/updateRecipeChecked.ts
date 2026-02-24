import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'

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
    const recipesDir = path.join(
      process.cwd(),
      'src',
      'data',
      'recipes',
      'json',
    )
    const filePath = path.join(recipesDir, `${recipeId}.json`)

    try {
      // Read the existing recipe
      const content = await fs.readFile(filePath, 'utf-8')
      const recipe: Recipe = JSON.parse(content)

      // Update the specific ingredient's checked state
      if (recipe.ingredients[ingredientIndex]) {
        recipe.ingredients[ingredientIndex].checked = checked
      }

      // Write back to file
      await fs.writeFile(filePath, JSON.stringify(recipe, null, 2), 'utf-8')

      return { success: true }
    } catch (error) {
      console.error(`Error updating recipe ${recipeId}:`, error)
      throw new Error('Failed to update recipe')
    }
  })
