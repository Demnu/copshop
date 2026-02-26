import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'
import { putToS3, getFromS3 } from '../../lib/s3'

const useS3 = process.env.USE_S3 === 'true'

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
      if (useS3) {
        // S3: check if exists, then write
        try {
          await getFromS3(`recipes/${recipe.id}.json`)
          throw new Error(`Recipe with id '${recipe.id}' already exists`)
        } catch (e: any) {
          // NoSuchKey is expected - means recipe doesn't exist yet
          if (e.name !== 'NoSuchKey' && !e.message.includes('already exists')) {
            throw e
          }
        }

        await putToS3(`recipes/${recipe.id}.json`, recipe)
        console.log(`✅ Created recipe in S3: ${recipe.id}`)
      } else {
        // Filesystem: check if exists, then write
        const recipesDir = path.join(
          process.cwd(),
          'src',
          'data',
          'recipes',
          'json',
        )
        const filePath = path.join(recipesDir, `${recipe.id}.json`)

        try {
          await fs.access(filePath)
          throw new Error(`Recipe with id '${recipe.id}' already exists`)
        } catch (e: any) {
          if (e.code !== 'ENOENT') throw e
        }

        await fs.writeFile(filePath, JSON.stringify(recipe, null, 2), 'utf-8')
        console.log(`✅ Created recipe in filesystem: ${recipe.id}`)
      }

      return { success: true, id: recipe.id }
    } catch (error: any) {
      console.error(`❌ Error creating recipe ${recipe.id}:`, error)
      throw new Error(error.message || 'Failed to create recipe')
    }
  })
