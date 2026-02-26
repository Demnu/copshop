import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Recipe } from './recipeSchemas'
import { putToS3, getFromS3 } from '../../lib/s3'

// Validation schema
const createRecipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1),
        checked: z.boolean().default(false),
      }),
    )
    .min(1),
})

export const createRecipe = createServerFn({ method: 'POST' })
  .inputValidator(createRecipeSchema)
  .handler(async (ctx): Promise<{ success: boolean; id: string }> => {
    const recipe: Recipe = ctx.data
    try {
      try {
        await getFromS3(`recipes/${recipe.id}.json`)
        throw new Error(`Recipe with id '${recipe.id}' already exists`)
      } catch (e: any) {
        if (e.name !== 'NoSuchKey' && !e.message.includes('already exists')) {
          throw e
        }
      }
      await putToS3(`recipes/${recipe.id}.json`, recipe)
      console.log(`✅ Created recipe in S3: ${recipe.id}`)
      return { success: true, id: recipe.id }
    } catch (error: any) {
      console.error(`❌ Error creating recipe ${recipe.id}:`, error)
      throw new Error(error.message || 'Failed to create recipe')
    }
  })
