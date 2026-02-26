import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'
import { getFromS3, putToS3 } from '../../lib/s3'

const useS3 = process.env.USE_S3 === 'true'

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
      let recipe: Recipe
      
      if (useS3) {
        // S3: read from cloud storage, update, write back
        recipe = await getFromS3(`recipes/${recipeId}.json`)
        
        if (recipe.ingredients[ingredientIndex]) {
          recipe.ingredients[ingredientIndex].checked = checked
        }
        
        await putToS3(`recipes/${recipeId}.json`, recipe)
      } else {
        // Filesystem: read from local directory, update, write back
        const recipesDir = path.join(process.cwd(), 'src', 'data', 'recipes', 'json')
        const filePath = path.join(recipesDir, `${recipeId}.json`)
        
        const content = await fs.readFile(filePath, 'utf-8')
        recipe = JSON.parse(content)
        
        if (recipe.ingredients[ingredientIndex]) {
          recipe.ingredients[ingredientIndex].checked = checked
        }
        
        await fs.writeFile(filePath, JSON.stringify(recipe, null, 2), 'utf-8')
      }

      return { success: true }
    } catch (error) {
      console.error(`Error updating recipe ${recipeId}:`, error)
      throw new Error('Failed to update recipe')
    }
  })
