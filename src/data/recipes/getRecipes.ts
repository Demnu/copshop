import { createServerFn } from '@tanstack/react-start'
import type { RecipeListItem, Recipe } from './recipeSchemas'
import { listFromS3, getFromS3 } from '../../lib/s3'

export const getRecipes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecipeListItem[]> => {
    console.log('Reading recipes from S3')
    try {
      const keys = await listFromS3('recipes/')
      const recipes: RecipeListItem[] = []
      for (const key of keys) {
        if (key && key.endsWith('.json')) {
          const recipe: Recipe = await getFromS3(key)
          recipes.push({ id: recipe.id, name: recipe.name })
        }
      }
      return recipes.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error reading recipes:', error)
      return []
    }
  },
)
