import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'

export const clearAllRecipeChecked = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      recipeId: z.string(),
    }),
  )
  .handler(async (ctx): Promise<{ success: boolean }> => {
    const { recipeId } = ctx.data
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

      // Update all ingredients to unchecked in one operation
      recipe.ingredients = recipe.ingredients.map((ing) => ({
        ...ing,
        checked: false,
      }))

      // Write back to file once
      await fs.writeFile(filePath, JSON.stringify(recipe, null, 2), 'utf-8')

      return { success: true }
    } catch (error) {
      console.error(`Error clearing recipe ${recipeId}:`, error)
      throw new Error('Failed to clear recipe')
    }
  })
