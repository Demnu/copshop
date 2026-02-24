import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { promises as fs } from 'fs'
import path from 'path'
import type { Recipe } from './recipeSchemas'

export const getRecipeById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ recipeId: z.string() }))
  .handler(async (ctx): Promise<Recipe | null> => {
    const recipesDir = path.join(process.cwd(), 'src', 'data', 'recipes', 'json')
    const filePath = path.join(recipesDir, `${ctx.data.recipeId}.json`)
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const recipe: Recipe = JSON.parse(content)
      return recipe
    } catch (error) {
      console.error(`Error reading recipe ${ctx.data.recipeId}:`, error)
      return null
    }
  })
