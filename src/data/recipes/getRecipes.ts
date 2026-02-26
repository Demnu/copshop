import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'fs'
import path from 'path'
import type { RecipeListItem, Recipe } from './recipeSchemas'
import { listFromS3, getFromS3 } from '../../lib/s3'

const useS3 = process.env.USE_S3 === 'true'

export const getRecipes = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecipeListItem[]> => {
    console.log(
      useS3 ? 'Reading recipes from S3' : 'Reading recipes from filesystem',
    )
    try {
      if (useS3) {
        // S3: read from cloud storage
        const keys = await listFromS3('recipes/')
        const recipes: RecipeListItem[] = []

        for (const key of keys) {
          if (key && key.endsWith('.json')) {
            const recipe: Recipe = await getFromS3(key)
            recipes.push({ id: recipe.id, name: recipe.name })
          }
        }

        return recipes.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        // Filesystem: read from local directory
        const recipesDir = path.join(
          process.cwd(),
          'src',
          'data',
          'recipes',
          'json',
        )
        const files = await fs.readdir(recipesDir)
        const jsonFiles = files.filter((file) => file.endsWith('.json'))

        const recipes: RecipeListItem[] = []
        for (const file of jsonFiles) {
          const filePath = path.join(recipesDir, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const recipe: Recipe = JSON.parse(content)
          recipes.push({ id: recipe.id, name: recipe.name })
        }

        return recipes.sort((a, b) => a.name.localeCompare(b.name))
      }
    } catch (error) {
      console.error('Error reading recipes:', error)
      return []
    }
  },
)
