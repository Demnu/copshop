import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'
import { getFromS3 } from '../../lib/s3'

const useS3 = process.env.USE_S3 === 'true'

export const getRecipeById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ recipeId: z.string() }))
  .handler(async (ctx): Promise<Recipe | null> => {
    try {
      if (useS3) {
        // S3: read from cloud storage
        const recipe: Recipe = await getFromS3(
          `recipes/${ctx.data.recipeId}.json`,
        )
        return recipe
      } else {
        // Filesystem: read from local directory
        const recipesDir = path.join(
          process.cwd(),
          'src',
          'data',
          'recipes',
          'json',
        )
        const filePath = path.join(recipesDir, `${ctx.data.recipeId}.json`)
        const content = await fs.readFile(filePath, 'utf-8')
        const recipe: Recipe = JSON.parse(content)
        return recipe
      }
    } catch (error) {
      console.error(`Error reading recipe ${ctx.data.recipeId}:`, error)
      return null
    }
  })
